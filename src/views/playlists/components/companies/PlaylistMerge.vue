<template>
  <v-layout row>
    <v-dialog v-model="dialogMerge" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn class="grey darken-1 text-capitalize" width="150" dark small v-on="on">
          <v-icon small >compare_arrows</v-icon>merge
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">
          Merge playlist "{{_get(playlist, 'name', '[empty name]')}}" with:
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
          <v-btn color="error" text class="text-capitalize" @click="dialogMerge = false">Close</v-btn>
          <v-btn color="green" text class="text-capitalize" dark @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import MergeAutocomplete from "../../../../components/playlists/MergeAutocomplete.vue";
import _get from "lodash.get";
import gql from "graphql-tag";

export default {
  data() {
    return {
      dialogMerge: false,
      selectedPlaylists: [],
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
        this.$eventBus.$emit("showSnack", "Please type a playlist name" , "error");
        return;
      }
      if (!this.selectedPlaylists.length) {
        this.$eventBus.$emit("showSnack", "At least one playlist needs to be selected" , "error");
        return;
      }
      if (!this.$props.playlist || !this.$props.playlist.uid) {
        this.$eventBus.$emit("showSnack", "Error getting current playlist uid" , "error");
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
          this.$eventBus.$emit("showSnack", "it seems that we created your playlist but couldn't check it, please check manually" , "error");
          return;
        }
        this.$eventBus.$emit("showSnack", "New playlist was created successfully!!!" , "success");
        this.dialogMerge = false;
        this.$router.push({
          path: `/playlists/${playlist.uid}/companies`
        });
      } catch (error) {
        this.$eventBus.$emit("showSnack", "oops we did something wrong!" , "error");
        console.log("error saving playlists merge", error);
      }
    },
    _get: _get
  }
};
</script>