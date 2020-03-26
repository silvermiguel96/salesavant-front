<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" xs="12">
        <v-card>
          <v-row no-gutters class="ml-2">
            <v-breadcrumbs
              :large="true"
              :items="[
                  {
                    text: 'Playlists',
                    disabled: true,
                    href: '/playlists'
                  }
              ]"
              divider=">"
              class="pl-0 pl-sm-2"
            ></v-breadcrumbs>
          </v-row>

          <v-row no-gutters class="pl-2 pl-sm-4">
            <v-col cols="10" sm="4">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Type a Name"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12">
              <play-lists-table
                v-if="playlists"
                :items="playlists.playlistsList"
                :totalResults="playlists.totalResults"
                @updateOptions="updateOptions"
                @deletePlaylist="deletePlaylist"
              ></play-lists-table>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12">
              <v-progress-linear
                :active="!!isLoading"
                color="blue"
                indeterminate
                absolute
                bottom
                query
              ></v-progress-linear>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import PlayListsTable from "./components/PlayListsTable.vue";
import { mapMutations } from "../../store";

export default {
  data() {
    return {
      items: ["playlists"],
      isLoading: true,
      search: "",
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: ""
      }
    };
  },
  components: {
    PlayListsTable
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.page = page;
      this.itemsPerPage = itemsPerPage;
      if (sortBy.length > 0) {
        switch (sortBy[0]) {
          case "totalCompanies":
            this.options.sortBy = "companies";
            break;
          case "creationTime":
            this.options.sortBy = "creation_time";
            break;
        }
      } else {
        this.options.sortBy = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.options.sortOrder = "desc";
        } else {
          this.options.sortOrder = "asc";
        }
      } else {
        this.options.sortOrder = "";
      }
    },
    async deletePlaylist(playlist) {
      try {
        console.log("Delete Id", playlist);
        const index = this.playlists.playlistsList.indexOf(playlist);
        let result = null;
        result = await this.$apollo.mutate({
          mutation: gql`
            mutation($playlistUid: String!) {
              deletePlaylist(playlistUid: $playlistUid) {
                status
                message
              }
            }
          `,
          variables: {
            playlistUid: playlist.uid
          }
        });
        console.log("Result", result);
        this.playlists.playlistsList.splice(index, 1);
        console.log(this.$apollo.queries);
        this.$eventBus.$emit(
          "showSnack",
          "The playlist was successfully deleted.",
          "success"
        );
        return;
      } catch (error) {
        this.$eventBus.$emit(
          "showSnack",
          "Oops! something went wrong when removing the playlist, please try again.",
          "error"
        );
        console.log("error delete playlist", error);
      } finally {
        this.showTable = true;
      }
    }
  },
  apollo: {
    playlists: {
      query: gql`
        query playlists(
          $search: String
          $first: Int
          $offset: Int
          $sortBy: String
          $sortOrder: String
        ) {
          playlists(
            search: $search
            first: $first
            offset: $offset
            sortBy: $sortBy
            sortOrder: $sortOrder
          ) {
            totalResults
            playlistsList {
              uid
              name
              creationTime
              accountId
              userId
              totalSignals
              totalCompanies
              totalScore
            }
          }
        }
      `,
      variables() {
        return {
          search: this.search,
          sortBy: this.options.sortBy,
          sortOrder: this.options.sortOrder,
          first: this.options.itemsPerPage,
          offset: this.options.itemsPerPage * this.options.page - this.options.itemsPerPage
        };
      },
      skip() {
        return this.search.length > 0 && this.search.length < 2;
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network"
    }
  }
};
</script>
