<template>
  <v-layout>
    <v-dialog v-model="dialog" persistent max-width="600px" lazy>
      <template v-slot:activator="{ on }">
        <v-btn small class="text-capitalize" color="green" dark v-on="on"><v-icon small>add</v-icon>Create playlist from search results</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Just give the playlist a name and that's it</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="playlistName" label="Playlist name" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" :disabled="!playlistName" flat @click="save">Save</v-btn>
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