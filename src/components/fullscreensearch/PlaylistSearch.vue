<template>
  <div>
    <v-subheader>Playlist Search</v-subheader>
    <v-snackbar top v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-form ref="playlistsSearchForm" @submit.prevent>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex>
            <v-text-field
              name="playlistsSearch"
              v-model="playlistsSearch"
              label="playlist name or description"
              @input="changeData"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex>
            <v-btn @click="search" type="submit" color="primary">
              <v-icon>search</v-icon>
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
      playlistsSearch: "",
      snack: false,
      snackColor: "",
      snackText: ""
    };
  },
  methods: {
    changeData(data) {
      this.$emit("change", { playlistsSearch: data });
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

