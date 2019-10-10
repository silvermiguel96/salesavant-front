<template>
  <v-layout row>
    <v-dialog v-model="dialogOrb" max-width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="grey darken-1" width="150" dark small v-on="on">
          <v-icon small>cloud_download</v-icon>
          <span class="text-capitalize">export companies</span>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Get export companies?</v-card-title>
        <v-card-text v-show="loading">
          We're currently creating the job for extracting the keywords for this playlist
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
        <v-card-text>A process to export the companies is about to begin, this process may take several times depending on the amount of data or the processes that are already queued.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialogOrb = false">Cancel</v-btn>
          <v-btn color="green darken-1" class="text-capitalize" text @click="exportCompanies">Start</v-btn>
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
    exportCompanies() {
      this.$emit("createOrbRefreshJob");
    }
  }
};
</script>