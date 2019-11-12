<template>
  <div>
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-form ref="playlistsSearchForm" @submit.prevent>
      <v-container grid-list-md text-xs-center>
        <v-layout >
          <v-flex>
            <v-text-field
              name="playlistsSearch"
              v-model="playlist.playlistsSearch"
              label="Playlist name or description"
              @input="changeData"
              autocomplete="off"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout >
          <v-flex xl6 xs6>
            <v-text-field
              name="moreThanCompanies"
              v-model="playlist.moreThanCompanies"
              label="More than companies"
              @input="changeData"
              autocomplete="off"
            ></v-text-field>
          </v-flex>
          <v-flex xl6 xs6>
            <v-text-field
              name="lessThanCompanies"
              v-model="playlist.lessThanCompanies"
              label="Less than companies"
              @input="changeData"
              autocomplete="off"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout >
          <v-flex d-flex  justify-center >
            <v-btn @click="search" class="text-capitalize" small type="submit" color="primary">
              <v-icon class="pr-1" small>search</v-icon>
              {{"playlists search"}}
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
    toggleSearch() {
      this.$emit("toggleSearch");
    },
    search() {
      this.toggleSearch();
      this.$emit("search");
    }
  }
};
</script>

