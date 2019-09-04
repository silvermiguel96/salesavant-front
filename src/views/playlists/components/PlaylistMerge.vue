<template>
  <v-layout>
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="dialogMerge" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn class="deep-purple darken-3 text-capitalize" dark small v-on="on"><v-icon small left>compare_arrows</v-icon>merge 
          

        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Merge playlist "{{_get(playlist, 'name', '[empty name]')}}" with:</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm10 md10>
                <v-text-field
                  :required="true"
                  :rules="requiredRules"
                  v-model="newPlaylistName"
                  label="New Playlist Name"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs12 sm10 md10>
                <merge-autocomplete @change="change" />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" small class="text-capitalize" @click="dialogMerge = false">Close</v-btn>
          <v-btn color="green" small class="text-capitalize" dark @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import MergeAutocomplete from "../../../components/playlists/MergeAutocomplete.vue";
import _get from "lodash.get";
import gql from "graphql-tag";

export default {
  data() {
    return {
      dialogMerge: false,
      selectedPlaylists: [],
      snack: false,
      snackColor: "",
      snackText: "",
      newPlaylistName: "",
      requiredRules: [v => !!v || "this field is required"]
    };
  },
  props: {
    playlist: {
      type: Object
    }
  },
  components: {
    MergeAutocomplete
  },
  methods: {
    change(data) {
      this.selectedPlaylists = data.selectedPlaylists;
    },
    async save() {
      console.log("this.selectedPlaylists", this.selectedPlaylists);
      if (!this.newPlaylistName) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Please type a playlist name";
        return;
      }
      if (!this.selectedPlaylists.length) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "At least one playlist needs to be selected";
        return;
      }
      if (!this.$props.playlist || !this.$props.playlist.uid) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Error getting current playlist uid";
        return;
      }
      try {
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation($name: String!, $playlistUids: [String]!) {
              mergePlaylist(name: $name, playlistUids: $playlistUids) {
                playlist {
                  uid
                  name
                }
              }
            }
          `,
          // Parameters
          variables: {
            name: this.newPlaylistName,
            playlistUids: [this.$props.playlist.uid, ...this.selectedPlaylists]
          }
        });
        console.log("saving playlists merge result", result);
        const playlist = _get(result, "data.mergePlaylist.playlist", null);
        if (!playlist) {
          this.snack = true;
          this.snackColor = "error";
          this.snackText =
            "it seems that we created your playlist but couldn't check it, please check manually";
          return;
        }
        this.snack = true;
        this.snackColor = "success";
        this.snackText = "New playlist was created successfully!!!";

        this.dialogMerge = false;
        this.$router.push({
          path: `/playlists/${playlist.uid}/companies`
        });
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "oops we did something wrong!";
        console.log("error saving playlists merge", error);
      }
    },
    _get: _get
  }
};
</script>