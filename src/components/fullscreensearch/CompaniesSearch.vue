<template>
  <div>
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-form ref="simpleSearchForm" @submit.prevent>
      <v-container grid-list-xs text-xs-center>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field name="name" v-model="company.name" label="Name" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              name="country"
              v-model="company.country"
              label="Country"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              name="description"
              label="Description"
              v-model="company.description"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="city" v-model="company.city" label="City" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="region" v-model="company.region" label="Region" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="state" v-model="company.state" label="State" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              name="website"
              v-model="company.website"
              label="Website eywords"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="status" v-model="company.status" label="Status" @input="changeData"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field
              name="moreThanEmployees"
              v-model="company.moreThanEmployees"
              label="More than y employees"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              name="lessThanEmployees"
              v-model="company.lessThanEmployees"
              label="Less than x employees"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field
                name="moreThanScore"
                v-model="company.moreThanScore"
                label="More than score"
                @input="changeData"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                name="lessThanScore"
                v-model="company.lessThanScore"
                label="Less than score"
                @input="changeData"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <signals-groups-autocomplete @change="onSignalsGroupAutocompleteChange" />
          </v-flex>
          <v-flex xs6>
            <signals-autocomplete @change="onSignalsAutocompleteChange" />
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <playlists-autocomplete @change="onPlaylistAutocompleteChange" />
          </v-flex>
          <v-flex  d-flex align-center  xs6>
            <v-btn @click="search" small class="text-capitalize" type="submit" color="primary">
              <v-icon small>search</v-icon>
              {{" Companies Search"}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import gql from "graphql-tag";
import _get from "lodash.get";
import PlaylistsAutocomplete from "../playlists/Autocomplete.vue";
import SignalsAutocomplete from "../signals/Autocomplete.vue";
import SignalsGroupsAutocomplete from "../signals/GroupsAutocomplete.vue";
export default {
  data() {
    return {
      company: {
        name: "",
        description: "",
        country: "",
        website: "",
        city: "",
        region: "",
        state: "",
        status: "",
        lessThanEmployees: 0,
        moreThanEmployees: 0,
        moreThanScore: 0,
        lessThanScore: 0,
        playlistUid: "",
        signalId: 0,
        signalGroup: ""
      },
      snack: false,
      snackColor: "",
      snackText: "",
      newPlaylistName: "",
      showNewPlaylistName: false
    };
  },
  components: {
    PlaylistsAutocomplete,
    SignalsAutocomplete,
    SignalsGroupsAutocomplete
  },
  methods: {
    changeData() {
      this.$emit("change", { ...this.company });
    },
    toggle() {
      this.$emit("toggle");
    },
    search() {
      this.toggle();
      this.$emit("search");
    },
    onPlaylistAutocompleteChange(value) {
      this.company = { ...this.company, ...value };
      this.changeData();
    },
    onSignalsAutocompleteChange(value) {
      this.company = { ...this.company, signalId: _get(value, "signalId", "") };
      this.changeData();
    },
    onSignalsGroupAutocompleteChange(value) {
      this.company = { ...this.company, ...value };
      this.changeData();
    },
    async save() {
      if (!this.atLeastOneCompanyFieldIsNotEmpty()) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText =
          "At least one company field search criteria is not empty!";
        return;
      }
      if (!this.showNewPlaylistName) {
        this.showNewPlaylistName = true;
        return;
      }
      if (!this.newPlaylistName) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "New Playlist Name can not be empty!";
        return;
      }
      if (this.atLeastOneCompanyFieldIsNotEmpty() && !!this.newPlaylistName) {
        try {
          const result = await this.$apollo.mutate({
            mutation: gql`
              mutation(
                $name: String
                $city: String
                $description: String
                $state: String
                $region: String
                $country: String
                $status: String
                $lessThanEmployees: Int
                $moreThanEmployees: Int
                $moreThanScore: Int
                $lessThanScore: Int
                $playlistName: String!
              ) {
                createPlaylistFromSearch(
                  companySearch: {
                    name: $name
                    city: $city
                    description: $description
                    state: $state
                    region: $region
                    country: $country
                    status: $status
                    lessThanEmployees: $lessThanEmployees
                    moreThanEmployees: $moreThanEmployees
                    moreThanScore: $moreThanScore
                    lessThanScore: $lessThanScore
                  }
                  playlistData: { name: $playlistName }
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
              name: _get(this.company, "name", ""),
              country: _get(this.company, "country", ""),
              description: _get(this.company, "description", ""),
              website: _get(this.company, "website", ""),
              city: _get(this.company, "city", ""),
              region: _get(this.company, "region", ""),
              state: _get(this.company, "state", ""),
              status: _get(this.company, "status", ""),
              lessThanEmployees: _get(this.company, "lessThanEmployees", "0"),
              moreThanEmployees: _get(this.company, "moreThanEmployees", "0"),
              moreThanScore: _get(this.company, "moreThanScore", "0"),
              lessThanScore: _get(this.company, "lessThanScore", "0"),
              playlistName: this.newPlaylistName
            }
          });
          console.log("saving simple search success", result);
          const playlist = _get(
            result,
            "data.createPlaylistFromSearch.playlist",
            null
          );
          if (!playlist) {
            this.snack = true;
            this.snackColor = "error";
            this.snackText =
              "it seems that we created your playlist but couldn't check it, please check manually";
            return;
          }
          this.toggle();
          this.$router.push({
            path: `/playlists/${playlist.uid}/companies`
          });
        } catch (error) {
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "oops we did something wrong!";
          console.log("error saving simple search as a play list", error);
        }
      }
    },
    atLeastOneCompanyFieldIsNotEmpty() {
      let result = false;
      for (let key in this.company) {
        console.log("key", key);
        if (!!this.company[key]) {
          result = true;
          break;
        }
      }
      return result;
    }
  }
};
</script>

