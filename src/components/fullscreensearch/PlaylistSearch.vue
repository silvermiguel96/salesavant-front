<template>
  <div>
    <v-subheader>Playlist Search</v-subheader>
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-form ref="playlistsSearchForm" @submit.prevent>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex>
            <v-text-field
              name="playlistsSearch"
              v-model="playlist.playlistsSearch"
              label="playlist name or description"
              @input="changeData"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xl6 xs6>
            <v-text-field
              name="moreThanCompanies"
              v-model="playlist.moreThanCompanies"
              label="More than companies"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex xl6 xs6>
            <v-text-field
              name="lessThanCompanies"
              v-model="playlist.lessThanCompanies"
              label="Less than companies"
              @input="changeData"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex>
            <v-btn @click="search" class="text-capitalize" small type="submit" color="primary">
              <v-icon small>search</v-icon>
              {{"Search playlists"}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
export default {
  data() {
    return {
      playlist: {
        lessThanCompanies: 0,
        moreThanCompanies: 0,
        playlistsSearch: ""
      },
      snack: false,
      snackColor: "",
      snackText: ""
    };
  },
  methods: {
    changeData(data) {
      this.$emit("change", { ...this.playlist });
    },
    toggle() {
      this.$emit("toggle");
    },
    search() {
      this.toggle();
      this.$emit("search");
    }
  }
};
</script>

