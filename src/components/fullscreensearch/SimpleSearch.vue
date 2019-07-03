<template>
  <div>
    <v-subheader>Simple Search</v-subheader>

    <v-alert :value="showError" dismissible type="error">{{errorMessage}}</v-alert>

    <v-form ref="simpleSearchForm" @submit.prevent>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex>
            <v-text-field
              name="simpleSearch"
              v-model="simpleSearch"
              label="name or description"
              @input="changeData"
            ></v-text-field>
          </v-flex>
          <v-flex v-if="showNewPlaylistName">
            <v-text-field
              name="newPlaylistName"
              v-model="newPlaylistName"
              label="New Playlist Name"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex>
            <v-btn @click="search" type="submit" color="primary">
              <v-icon>search</v-icon>
              {{" Do a simple Search"}}
            </v-btn>
          </v-flex>
          <v-flex>
            <v-btn @click="save" color="success">
              <v-icon>save</v-icon>
              {{" Save search results as playlist"}}
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
      simpleSearch: "",
      showError: false,
      newPlaylistName: "",
      errorMessage: "",
      showNewPlaylistName: false
    };
  },
  methods: {
    changeData(data) {
      this.$emit("change", { simpleSearch: data });
    },
    toggle() {
      this.$emit("toggle");
    },
    search() {
      this.toggle();
      this.$emit("search");
    },
    async save() {
      if (!this.simpleSearch) {
        this.errorMessage = "Simple search criteria can not be empty!";
        this.showError = true;
        return;
      }
      if (!this.showNewPlaylistName) {
        this.showNewPlaylistName = true;
        return;
      }
      if (!this.newPlaylistName) {
        this.errorMessage = "New Playlist Name can not be empty!";
        this.showError = true;
        return;
      }
      if (!!this.simpleSearch && !!this.newPlaylistName) {
        try {
          const result = await this.$apollo.mutate({
            mutation: gql`
              mutation($simpleSearch: String, $playlistName: String!) {
                createPlaylistFromSearch(
                  companySearch: { search: $simpleSearch }
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
              simpleSearch: this.simpleSearch,
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
    }
  }
};
</script>

