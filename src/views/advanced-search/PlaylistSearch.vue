<template>
  <div>
    <v-form ref="playlistsSearchForm" @submit.prevent>
      <v-container grid-list-md text-xs-center>
        <v-layout >
          <v-flex>
            <v-text-field
              name="search"
              v-model="playlistSearch.search"
              label="Playlist name or description"
              autocomplete="off"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout >
          <v-flex xl6 xs6>
            <v-text-field
              name="moreThanCompanies"
              v-model="playlistSearch.moreThanCompanies"
              label="More than companies"
              autocomplete="off"
              number
            ></v-text-field>
          </v-flex>
          <v-flex xl6 xs6>
            <v-text-field
              name="lessThanCompanies"
              v-model="playlistSearch.lessThanCompanies"
              label="Less than companies"
              autocomplete="off"
              number
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
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      playlistSearch: {
        moreThanCompanies: 0,
        lessThanCompanies: 0,
        search: ""
      }
    };
  },
  methods: {
    ...mapMutations([
      'doPlaylistsSearch'
    ]),
    search() {
      if (this.$route.path !== "/playlists"){
        this.$router.push("/playlists");
      }
      this.doPlaylistsSearch({...this.playlistSearch});
    }
  }
};
</script>

