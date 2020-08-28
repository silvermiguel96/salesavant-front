<template>
  <v-layout>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn id="button-open-playlist" color="primary" class="text-capitalize" block v-on="on">
          <v-icon small>add</v-icon>save as playlist
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Playlist Name</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="playlistName" id="field-playlist-name" label="Playlist name" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog = false">Close</v-btn>
          <v-btn id="button-save-playlist" color="green darken-1" class="text-capitalize" :disabled="!playlistName" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    playlistName: ""
  }),
  methods: {
    save() {
      if (!!this.playlistName) {
        this.$emit("onSave", this.playlistName);
        this.dialog = false;
      }
    }
  }
};
</script>