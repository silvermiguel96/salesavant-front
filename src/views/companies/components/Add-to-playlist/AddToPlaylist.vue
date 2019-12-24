<template>
  <v-card class="ma-3">
    <v-card-title>
      <h1 class="headline">Playlists</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-layout d-flex class="m-1">
        <v-flex xs10 md11 lg11>
          <playlists-autocomplete
            @change="onPlaylistAutoCompleteChange"
            @onSearch="onSignalAutoCompleteSearch"
          />
        </v-flex>
        <v-flex d-flex align-end xs2 sm1 lg1>
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
        :items="companyPlaylists.companyPlaylistsList"
        :server-items-length="companyPlaylists.totalResults"
        class="elevation-1 mx-2"
        :items-per-page="options.itemsPerPage"
        :footer-props="{
          'items-per-page-options': [10, 20, 50]
        }"
        :options.sync="options"
        @updateOptions="updateOptions"
      >
        <template v-slot:item="{ item, headers }">
          <tr>
            <td>
              <router-link :to="`/playlists/${item.uid}/companies`">{{
                item.name || "--"
              }}</router-link>
            </td>
            <td>
              <v-icon
                @click="deleteCompanyPlaylist(item.uid)"
                color="red lighten-2"
                size="20"
                >delete</v-icon
              >
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
import playlistsAutocomplete from "../../../../components/playlists/PlaylistAutocomplete.vue";
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
      options: {
        page: 1,
        itemsPerPage: 10
      },
      companySignals: [],
      descending: false,
      sortBy: "",
      headers: [
        { text: "Name", value: "name" },
        { text: "Delete", value: "action" }
      ]
    };
  },
  components: {
    playlistsAutocomplete
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
            totalResults
            companyPlaylistsList {
              uid
              name
            }
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid ,
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = options.page;
      this.options.itemsPerPage = options.itemsPerPage;
    },
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
            //this.snackText ="Oops!! we did something wrong when saving the company - playlist, please try again!!";
            return;
          }
          //this.snackText = "The playlist is add to company";
          this.refreshData();
          return;
        } else {
          console.log("hola5");
          //this.snackText = "Select a playlist first";
          return;
        }
      } catch (error) {
        console.log("Error");
        //this.snackText = "Oops we did something wrong!!";
        console.log("error adding playlist to company", error);
      }
    },
    async deleteCompanyPlaylist(playlistUid) {
      console.log("playlistUid", playlistUid);
      try {
        console.log("Ingreso en el try");
        if (!playlistUid) {
          //this.snackText = "Select a playlist to delete!!";
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
        //this.snackText = "The playlist is delete to company";
        this.refreshData();
      } catch (error) {
        //this.snackText = "Oops we did something wrong!!";
        console.log("Error in delete playlist to company");
      }
    }
  },
  beforeCreate() {
    this.$apollo.queries.companyPlaylists;
  }
};
</script>
<style></style>
