<template>
  <v-container fluid>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          id="button-open-playlist"
          color="light-blue darken-1"
          class="text-capitalize"
          min-width="250px"
          v-on="on"
          v-bind="attrs"
          block
          dark
        >
          <v-icon small>add</v-icon>save as playlist
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Playlist Data</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="playlistName"
              id="field-playlist-name"
              label="Playlist name"
              autocomplete="off"
              required
            ></v-text-field>
            <v-checkbox v-model="autoUpdate" label="Auto Update"></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog = false">Close</v-btn>
          <v-btn
            id="button-save-playlist"
            color="primary"
            class="text-capitalize"
            text
            @click="save"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    playlistName: "",
    autoUpdate: false,
  }),
  methods: {
    save() {
      if (!!this.playlistName) {
        this.$emit("onSave", {
          newPlaylistName: this.playlistName,
          newPlaylistAutoUpdate: this.autoUpdate,
        });
        this.dialog = false;
      }
    },
  },
};
</script>