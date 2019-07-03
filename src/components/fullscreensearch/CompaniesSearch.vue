<template>
  <div>
    <v-subheader>Companies Search</v-subheader>
    <v-alert :value="showError" dismissible type="error">{{errorMessage}}</v-alert>
    <v-form ref="simpleSearchForm" @submit.prevent>
      <v-container grid-list-xs text-xs-center>
        <v-layout row wrap>
          <v-flex xs3>
            <v-text-field name="name" v-model="company.name" label="name" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              name="country"
              v-model="company.country"
              label="country"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field name="city" v-model="company.city" label="city" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field name="region" v-model="company.region" label="region" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field
              name="website"
              v-model="company.website"
              label="website"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field name="status" v-model="company.status" label="status" @input="changeData"></v-text-field>
          </v-flex>
          <v-flex xs3>
            <v-text-field name="state" v-model="company.state" label="state" @input="changeData"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs2>
            <v-text-field
              name="moreThanEmployees"
              v-model="company.moreThanEmployees"
              label="More than y employees"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs2>
            <v-text-field
              name="lessThanEmployees"
              v-model="company.lessThanEmployees"
              label="Less than x employees"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xs4 />
          <v-flex xs4>
            <v-btn @click="search" type="submit" color="primary">
              <v-icon>search</v-icon>
              {{" Do a companies Search"}}
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs8>
            <v-text-field
              v-if="showNewPlaylistName"
              name="newPlaylistName"
              v-model="newPlaylistName"
              label="New Playlist Name"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-btn @click="save" color="success">
              <v-icon>save</v-icon>
              {{" Save Companies search results as playlist"}}
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
        country: "",
        website: "",
        city: "",
        region: "",
        state: "",
        status: "",
        lessThanEmployees: 0,
        moreThanEmployees: 0
      },
      showError: false,
      newPlaylistName: "",
      errorMessage: "",
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
        this.errorMessage =
          "At least one company field search criteria is not empty!";
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 5000);
        return;
      }
      if (!this.showNewPlaylistName) {
        this.showNewPlaylistName = true;
        return;
      }
      if (!this.newPlaylistName) {
        this.errorMessage = "New Playlist Name can not be empty!";
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 5000);
        return;
      }
      if (this.atLeastOneCompanyFieldIsNotEmpty() && !!this.newPlaylistName) {
        try {
          const result = await this.$apollo.mutate({
            mutation: gql`
              mutation(
                $name: String
                $city: String
                $state: String
                $region: String
                $country: String
                $status: String
                $lessThanEmployees: Int
                $moreThanEmployees: Int
                $playlistName: String!
              ) {
                createPlaylistFromSearch(
                  companySearch: {
                    name: $name
                    city: $city
                    state: $state
                    region: $region
                    country: $country
                    status: $status
                    lessThanEmployees: $lessThanEmployees
                    moreThanEmployees: $moreThanEmployees
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
              website: _get(this.company, "website", ""),
              city: _get(this.company, "city", ""),
              region: _get(this.company, "region", ""),
              state: _get(this.company, "state", ""),
              status: _get(this.company, "status", ""),
              lessThanEmployees: _get(this.company, "lessThanEmployees", "0"),
              moreThanEmployees: _get(this.company, "moreThanEmployees", "0"),
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
            this.errorMessage =
              "it seems that we created your playlist but couldn't check it, please check manually";
            this.showError = true;
            return;
          }
          this.toggle();
          this.$router.push({
            path: `/playlists/${playlist.uid}/companies`
          });
        } catch (error) {
          this.errorMessage = "oops we did something wrong!";
          this.showError = true;
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

