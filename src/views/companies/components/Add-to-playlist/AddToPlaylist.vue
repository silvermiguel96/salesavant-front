<template>
  <v-card class="ma-3">
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-card-title>
      <h1 class="display-1">Playlists</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-layout >
        <v-flex xs10 md11 lg10 class="m-1">
          <playlists-autocomplete
            @change="onPlaylistAutoCompleteChange"
            @onSearch="onSignalAutoCompleteSearch"
          />
        </v-flex>
        <v-flex d-flex align-end xs2 sm1 lg2>
          <v-btn
            @click="addPlaylistToCompany"
            small
            :disabled="!playlistUid && !currentPlaylistSearch"
            class="mx-2"
          >
            <v-icon small>add</v-icon>Add
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="companyPlaylists.playlistsList"
        class="elevation-1"
        :items-per-page="pagination.rowsPerPage"
        :footer-props="{
          'items-per-page-options': pagination.rowsPerPageItems
        }"
        @updatepagination="updatePagination"
        :server-items-length="totalItems"
      >
        <template v-slot:item="{ item, headers }">
          <tr>
            <td>
              <router-link
                :to="`/playlists/${item.uid}/companies`"
              >{{ item.name || "--"}}</router-link>
            </td>
            <td>
              <v-icon
                @click="deleteCompanyPlaylist(item.uid)"
                color="red lighten-2"
                size="20"
              >delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
import playlistsAutocomplete from "../../../../components/playlists/Autocomplete.vue";
import _get from "lodash.get";
export default {
  data() {
    return {
      playlistUid: null,
      playlistsList: [],
      companyPlaylists: [],
      currentPlaylistSearch: null,
      snack: false,
      snackColor: "",
      snackText: "",
      updatePagination: "",
      pagination: {
        page: 1,
        rowsPerPage: 25,
        rowsPerPageItems: [25, 50, 100]
      },
      companySignals: [],
      descending: false,
      sortBy: "",
      totalItems: 10000000,
      headers: [
        { text: "Name", value: "name" },
        { text: "Delete", value: "action" }
      ]
    };
  },
  components: {
    playlistsAutocomplete
  },
  methods: {
    updatePagination({
      dataFromEvent: {
        descending = false,
        page = 1,
        rowsPerPage = 5,
        sortBy = "",
        totalItems = 10000000
      }
    }) {
      this.descending = descending;
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.sortBy = sortBy;
      this.totalItems = totalItems;
    }
  },
  apollo: {
    companyPlaylists: {
      query: gql`
        query searchCompanyPlaylists(
          $companyUid: String
          $first: Int
          $offset: Int
        ) {
          companyPlaylists(
            companyUid: $companyUid
            first: $first
            offset: $offset
          ) {
            name
            playlistsList {
              uid
              name
            }
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid | "",
          first: this.pagination.rowsPerPage,
          offset:
            this.pagination.rowsPerPage * this.pagination.page -
            this.pagination.rowsPerPage
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  methods: {
    onPlaylistAutoCompleteChange(playlistResults) {
      this.playlistUid = _get(playlistResults, "playlistUid", null);
      this.currentPlaylistSearch = _get(
        playlistResults,
        "currentPlaylistSearch",
        null
      );
    },
    onSignalAutoCompleteSearch(playlistResults) {
      this.currentPlaylistSearch = _get(
        playlistResults,
        "currentPlaylistSearch",
        null
      );
    },
    refreshData() {
      this.$apollo.queries.companyPlaylists.refresh();
    },
    async addPlaylistToCompany() {
      console.log("Ingreso a la funcion");
      try {
        console.log("Ingreso a la promesa");
        if (!!this.playlistUid || !!this.currentPlaylistSearch) {
          console.log("hola3");
          const result = await this.$apollo.mutate({
            mutation: gql`
              mutation($companyUid: String!, $playlistUid: String!) {
                addCompanyToPlaylist(
                  playlistUid: $playlistUid
                  companyUid: $companyUid
                ) {
                  playlist {
                    uid
                    name
                  }
                }
              }
            `,
            // Parameters
            variables: {
              playlistUid: this.playlistUid,
              companyUid: this.$route.params.companiesUid
            }
          });
          console.log("result", result);
          const newPlaylistId = _get(
            result,
            "data.addCompanyToPlaylist.playlist.uid",
            null
          );
          console.log("newPlaylistId", newPlaylistId);
          if (!newPlaylistId) {
            this.snack = true;
            this.snackColor = "error";
            this.snackText =
              "Oops!! we did something wrong when saving the company - playlist, please try again!!";
            return;
          }
          this.snack = true;
          this.snackColor = "success";
          this.snackText = "The playlist is add to company";
          this.refreshData();
          return;
        } else {
          console.log("hola5");
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "Select a playlist first";
          return;
        }
      } catch (error) {
        console.log("Error");
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Oops we did something wrong!!";
        console.log("error adding playlist to company", error);
      }
    },
    async deleteCompanyPlaylist(playlistUid) {
      console.log("playlistUid", playlistUid);
      try {
        console.log("Ingreso en el try");
        if (!playlistUid) {
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "Select a playlist to delete!!";
          console.log("Error in delete playlist to company");
          return;
        }
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation($companyUid: String!, $playlistUid: String!) {
              deleteCompanyFromPlaylist(
                playlistUid: $playlistUid
                companyUid: $companyUid
              ) {
                playlist {
                  uid
                  name
                }
              }
            }
          `,
          // Parameters
          variables: {
            playlistUid: playlistUid,
            companyUid: this.$route.params.companiesUid
          }
        });
        console.log("result", result);
        // const newPlaylistId = _get(
        //   result,
        //   "data.addCompanyToPlaylist.playlist.uid",
        //   null
        // );
        // console.log("newPlaylistId", newPlaylistId);
        // if (!newPlaylistId) {
        //   this.snack = true;
        //   this.snackColor = "error";
        //   this.snackText =
        //     "Oops!! we did something wrong when saving the company - playlist, please try again!!";
        //   return;
        // }
        this.snack = true;
        this.snackColor = "success";
        this.snackText = "The playlist is delete to company";
        this.refreshData();
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Oops we did something wrong!!";
        console.log("Error in delete playlist to company");
      }
    }
  },
  beforeCreate() {
    this.$apollo.queries.companyPlaylists;
  }
};
</script>
<style>
</style>
