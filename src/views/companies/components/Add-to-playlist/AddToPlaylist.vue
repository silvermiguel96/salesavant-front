<template>
  <v-card>
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
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <router-link :to="`/playlists/${item.uid}`">
                {{
                item.name || "--"
                }}
              </router-link>
            </td>
            <td>{{ item.totalCompanies ? item.totalCompanies.toLocaleString() : "0"}}</td>
            <td>
              {{ item.creationTime | moment("dddd, MMMM Do YYYY, h:mm:ss a")}}
            </td>
            <td>
              <div class="d-flex align-center justify-center">
                <v-icon color="red lighten-2" small @click="deleteCompanyPlaylist(item)">delete</v-icon>
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
      companyPlaylists: [],
      currentPlaylistSearch: null,
      options: {
        page: 1,
        itemsPerPage: 10
      },
      headers: [
        { text: "Name", value: "name", width: "30%", sortable: false },
        { text: "Size", value: "totalCompanies", width: "30%", sortable: true },
        {
          text: "Creation Time",
          value: "creationTime",
          width: "30%",
          sortable: false
        },
        {
          text: "Remove",
          value: "action",
          width: "10%",
          sortable: false,
          align: "center"
        }
      ]
    };
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
            this.options.itemsPerPage,
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  components: {
    playlistsAutocomplete
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10 }
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
    addPlaylistToCompany() {
      try {
        console.log("playlistUid", this.playlistUid);
        const equalPlaylist = this.companyPlaylists.companyPlaylistsList.find(
          playlist => {
            if (playlist.uid == this.playlistUid) {
              return true;
            }
          }
        );
        if (
          (!!this.playlistUid || !!this.currentPlaylistSearch) &&
          !equalPlaylist
        ) {
          console.log("hola3");
          this.$apollo
            .mutate({
              mutation: gql`
                mutation($companyUid: String!, $playlistUid: String!) {
                  addCompanyToPlaylist(
                    playlistUid: $playlistUid
                    companyUid: $companyUid
                  ) {
                    playlist {
                      uid
                      name
                      totalCompanies
                      creationTime
                    }
                  }
                }
              `,
              // Parameters
              variables: {
                playlistUid: this.playlistUid,
                companyUid: this.$route.params.companiesUid
              }
            })
            .then(result => {
              console.log("result", result);
              if (!!result && !!result.data.addCompanyToPlaylist) {
                this.companyPlaylists.totalResults += 1;
                this.companyPlaylists.companyPlaylistsList.push(
                  result.data.addCompanyToPlaylist.playlist
                );
                console.log(
                  "this.companyPlaylists.totalResults",
                  this.companyPlaylists.totalResults
                );
                console.log(
                  "this.companyPlaylists.companyPlaylistsList",
                  this.companyPlaylists.companyPlaylistsList
                );
                const newPlaylistId = _get(
                  result,
                  "data.addCompanyToPlaylist.playlist.uid",
                  null
                );
                console.log("newPlaylistId", newPlaylistId);
                if (!newPlaylistId) {
                  return;
                }
                this.$eventBus.$emit(
                  "showSnack",
                  "New playlist successfully created!!",
                  "success"
                );
              }
            });
        } else {
          console.log("hola5");
          this.$eventBus.$emit(
            "showSnack",
            "The playlist is already in the company!!",
            "error"
          );
          return;
        }
      } catch (error) {
        console.log("Error");
        console.log("error adding playlist to company", error);
      }
    },
    async deleteCompanyPlaylist(playlist) {
      console.log("playlist", playlist);
      const res = await this.$confirm(
        `<h1 class="subtitle-1">
              Confirm you want to eliminate the playlist
              <span class="font-weight-bold"
              >${playlist.name}</span>?
            </h1> `,
        {
          buttonTrueText: "delete",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "primary",
          icon: "delete",
          title: "Delete Comment",
          width: 600
        }
      );
      if (res) {
        try {
          const index = this.companyPlaylists.companyPlaylistsList.indexOf(
            playlist
          );
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
              playlistUid: playlist.uid,
              companyUid: this.$route.params.companiesUid
            }
          });
          console.log("result", result);
          this.companyPlaylists.companyPlaylistsList.splice(index, 1);
          this.companyPlaylists.totalResults -= 1;
          this.$eventBus.$emit(
            "showSnack",
            "The playlist successfully delete!!",
            "success"
          );
        } catch (error) {
          console.log("error", error);
          this.$eventBus.$emit(
            "showSnack",
            "Error in delete singal!!",
            "error"
          );
        }
      }
    }
  },
  beforeCreate() {
    this.$apollo.queries.companyPlaylists;
  }
};
</script>
