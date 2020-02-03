<template>
  <v-card class="ma-3">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Delete playlist</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <h1 class="subtitle-1">
              Confirm you want to eliminate the playlist
              <span
                class="font-weight-bold"
              >{{selectedIPlaylist.name}}</span>?
            </h1>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog = false">Close</v-btn>
          <v-btn
            color="red darken-1"
            class="text-capitalize"
            text
            @click="deleteCompanyPlaylist(selectedPlaylistId)"
          >Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card-text>
      <v-row>
        <v-col xl="11" lg="10" md="10" xs="12" sm="9" cols="12">
          <playlists-autocomplete
            @change="onPlaylistAutoCompleteChange"
            @onSearch="onSignalAutoCompleteSearch"
          />
        </v-col>
        <v-col xl="1" lg="2" md="2" xs="12" sm="3" cols="12">
          <v-btn
            color="primary"
            block
            class="text-capitalize mt-3"
            @click="addPlaylistToCompany"
            :disabled="!playlistUid && !currentPlaylistSearch"
          >
            <v-icon small>add</v-icon>Add to playlist
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="companyPlaylists.companyPlaylistsList"
        :server-items-length="companyPlaylists.totalResults"
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
              <router-link :to="`/playlists/${item.uid}`">
                {{
                item.name || "--"
                }}
              </router-link>
            </td>
            <td>{{ item.totalCompanies ? item.totalCompanies.toLocaleString() : "0"}}</td>
            <td>{{ changeTimeHuman(item.creationTime) }}</td>
            <td>
              <div class="d-flex align-center justify-center">
              <v-icon
                color="red lighten-2"
                size="20"
                @click="selectPlaylist({
                  item: item,
                  playlistId: item.uid
              })"
              >delete</v-icon>
              </div>
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
      dialog: false,
      headers: [
        { text: "Name", value: "name", width: "30%", sortable: false },
        { text: "Size", value: "totalCompanies", width: "30%", sortable: true },
        {
          text: "Creation Time",
          value: "creationTime",
          width: "30%",
          sortable: false
        },
        { text: "Delete", value: "action", width: "10%", sortable: false,  align: "center" }
      ],
      selectedIPlaylist: "",
      selectedPlaylistId: {}
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
              totalCompanies
              creationTime
            }
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid,
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
    changeTimeHuman(time) {
      let humanDate = time.split(".", 1).toString();
      let humanTime = humanDate.split("T", 2).join(" ");
      return humanTime;
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
    selectPlaylist({ item, playlistId }) {
      this.selectedIPlaylist = item;
      this.selectedPlaylistId = playlistId;
      this.dialog = true;
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
        this.dialog = false;
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
