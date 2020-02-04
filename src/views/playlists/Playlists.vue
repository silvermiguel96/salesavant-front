<template>
  <v-container fluid>
    <v-card>
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
      >
      </v-breadcrumbs>
      <v-container fluid class="mx-1">
        <v-row no-gutters class="ml-2">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Filter"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <ApolloQuery
        :query="require('./graphql/Playlists.gql')"
        :variables="{
          search: this.search,
          first: this.itemsPerPage,
          offset: this.itemsPerPage * this.page - this.itemsPerPage,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder
        }"
        :skip="search.length > 0 && search.length < 2"
      >
        <template  v-slot="{ result: { loading, error, data }, isLoading }">
          <!-- Result -->
            <play-lists-table
              v-if="data.playlists.playlistsList"
              :items="data.playlists.playlistsList"
              :totalResults="data.playlists.totalResults"
              class="result apollo"
              @updateOptions="updateOptions"
              @deletePlaylist="deletePlaylist"
            ></play-lists-table>

            <!-- No result -->
            <div v-else >No data was returned</div>

            <!-- Loading -->
            <v-row  :justify="center" no-gutters>
                <v-col  cols="12">
                  <v-progress-linear
                  :active="isLoading"
                  color="blue"
                  indeterminate
                  absolute
                  bottom
                  query
                  ></v-progress-linear>
                </v-col>
            </v-row>

        </template>
      </ApolloQuery>
    </v-card>
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
      page: 1,
      itemsPerPage: 10,
      sortBy: "",
      sortOrder: "",
      search: ""
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
            this.sortBy = "companies";
            break;
        }
      } else {
        this.sortBy = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.sortOrder = "desc";
        } else {
          this.sortOrder = "asc";
        }
      } else {
        this.sortOrder = "";
      }
    },
    async deletePlaylist(playlistUid) {
      console.log("Delete Id", playlistUid);
      try {
        let result = null;
        result = await this.$apollo.mutate({
          mutation: gql`
            mutation($playlistUid: String!) {
              deletePlaylist(playlistUid: $playlistUid) {
                playlist {
                  uid
                }
              }
            }
          `,
          variables: {
            playlistUid: playlistUid
          }
        });
        console.log("Result", result);
        this.$router.go(this.$router.currentRoute);
        console.log(this.$apollo.queries);
        return;
      } catch (error) {
        console.log("error delete playlist", error);
      } finally {
        this.showTable = true;
      }
    }
  } 
};
</script>
