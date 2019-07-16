<template>
  <div>
    <v-subheader>Simple Search</v-subheader>
    <!--TODOLISTO: cambiar v-aler por v-snackbar -->
    <v-snackbar top v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
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
      snack: false,
      snackColor: "",
      snackText: "",
      newPlaylistName: "",
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
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Simple search criteria can not be empty!";
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
            this.snack = true;
            this.snackColor = "error";
            this.snackText = "it seems that we created your playlist but couldn't check it, please check manually";
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
    }
  }
};
</script>

