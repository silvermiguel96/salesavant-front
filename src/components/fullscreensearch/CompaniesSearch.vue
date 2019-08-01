<template>
  <!-- TODO: agregar filtros lessThanScore moreThanScore -->
  <!--TODO: habilitar nuevamente morethan y lessthan employeess-->
  <!-- TODO: agregar filtros lessThanScore moreThanScore -->
  <!-- TODO: agregar filtros por playlist CAMILO -->
  <div>
    <v-subheader>Companies Search</v-subheader>
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-form ref="simpleSearchForm" @submit.prevent>
      <v-container grid-list-xs text-xs-center>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field name="name" v-model="company.name" label="name" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              name="country"
              v-model="company.country"
              label="country"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-textarea
              name="description"
              label="Description"
              v-model="company.description"
              @input="changeData"
            ></v-textarea>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="city" v-model="company.city" label="city" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="region" v-model="company.region" label="region" @input="changeData"></v-text-field>
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
          <v-flex xs6>
            <v-text-field
              name="website"
              v-model="company.website"
              label="website keywords"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="status" v-model="company.status" label="status" @input="changeData"></v-text-field>
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
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field name="state" v-model="company.state" label="state" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-btn @click="search" type="submit" color="primary">
              <v-icon>search</v-icon>
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
        lessThanScore: 0
      },
      snack: false,
      snackColor: "",
      snackText: "",
      newPlaylistName: "",
      showNewPlaylistName: false
    };
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

