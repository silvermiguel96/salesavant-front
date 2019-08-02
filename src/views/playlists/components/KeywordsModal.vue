<template>
  <v-layout row>
    <v-dialog v-model="dialog" persistent max-width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="success" dark v-on="on">Get keywords</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Get keywords?</v-card-title>
        <v-card-text v-show="loading">
          We're currently creating the job for extracting the keywords for this playlist
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
        <v-card-text>You're about to start a process to get this playlist keywords, this process can have several time depending on the data amount or the already queued processes.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" flat @click="createKeywordsJob">Start process</v-btn>
          <v-btn color="error" flat @click="dialog = false">Cancel, I will do it in other time</v-btn>
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
      dialog: false
    };
  },
  props: {
    loading: { type: Boolean, default: false }
  },
  methods: {
    createKeywordsJob() {
      this.$emit("createKeywordsJob");
    }
  }
};
</script>