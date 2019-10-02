<template>
  <v-layout row>
    <v-dialog v-model="dialogOrb" max-width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="success" dark small  v-on="on"><v-icon small>autorenew</v-icon>ORB <span class="text-capitalize">refresh</span></v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Get ORB?</v-card-title>
        <v-card-text v-show="loading">
          We're currently creating the job for extracting the keywords for this playlist
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
        <v-card-text>You're about to start a process to get this playlist orb, this process can have several time depending on the data amount or the already queued processes.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialogOrb = false">Cancel</v-btn>
          <v-btn color="success"  text @click="createOrbRefreshJob">Start</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import _get from "lodash.get";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      dialogOrb: false
    };
  },
  props: {
    loading: { type: Boolean, default: false }
  },
  methods: {
    createOrbRefreshJob() {
      this.$emit("createOrbRefreshJob");
    }
  }
};
</script>