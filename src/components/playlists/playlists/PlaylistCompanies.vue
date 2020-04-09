<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" xs="12" class="px-0">
        <v-row no-gutters class="pl-2 pl-sm-6">
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
            <playlists-table
              v-if="playlists"
              :items="playlists.playlistsList"
              :totalResults="playlists.totalResults"
              :folderId="folderId"
              :folderName="folderName"
              @updateOptions="updateOptions"
              @deletePlaylist="deletePlaylist"
            ></playlists-table>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import PlaylistsTable from "../PlaylistsTable.vue";

export default {
  data() {
    return {
      search: "",
      isLoading: true,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: ""
      }
    };
  },
  components: {
    PlaylistsTable
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
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
      }
    }
  },
  apollo: {
    playlists: {
      query: gql`
        query playlists(
          $folderId: Int
          $search: String
          $first: Int
          $offset: Int
          $sortBy: String
          $sortOrder: String
        ) {
          playlists(
            playlistType: "company"
            folderId: $folderId
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
              totalCompanies
              totalContacts
            }
          }
        }
      `,
      variables() {
        return {
          folderId: parseInt(this.folderId),
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
  },
  props: {
    folderId: {
      type: String,
      default: null
    },
    folderName: {
      type: String,
      default: null
    }
  }
};
</script>
