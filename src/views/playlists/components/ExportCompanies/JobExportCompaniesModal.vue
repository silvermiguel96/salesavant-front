<template>
  <v-layout row>
    <v-dialog v-model="dialog" max-width="1000">
      <v-card>
        <v-card-title class="headline">Export companies</v-card-title>
        <v-card-text>
          <div>
            <v-progress-circular v-show="loading" :size="60" indeterminate color="primary"></v-progress-circular>
          </div>
          <p>
            <strong>Status:</strong>
            {{job.status}}
          </p>
          <v-progress-linear v-model="job.progress" height="25" class="white--text">
            <strong>{{ Math.ceil(job.progress) }}%</strong>
          </v-progress-linear>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="onClose">Close</v-btn>
          <div v-for="filename in job.results" :key="filename">
            <v-btn color="green darken-1" class="text-capitalize" text :href="`http://localhost:4000${filename}`">Download</v-btn>
          </div>
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
      headers: [
        {
          text: "Keyword",
          align: "left",
          sortable: false
        },
        { text: "Total", align: "left", sortable: false },
        { text: "Score", align: "left", sortable: false },
        { text: "Actions", align: "left", sortable: false }
      ]
    };
  },
  props: {
    job: { type: Object, required: true },
    loading: { type: Boolean, default: false },
    dialog: { type: Boolean, default: false }
  },
  methods: {
    onClose() {
      this.$emit("onClose");
    },
    _get: _get,
    isThereAJobForTheSamePlaylist() {
      const playlistId = _get(this.$route, "params.playlistId", null);
      const jobs = Object.keys(localStorage)
        .filter(key => key.indexOf("job") > -1)
        .map(key => JSON.parse(localStorage[key]));

      console.log("jobs", jobs);

      const existingJob = jobs.find(element => element.entityId === playlistId);

      console.log("existingJob", existingJob);
      return existingJob;
    },
    refreshJobOrb() {
      this.$emit("refreshJobOrb", this.$props.job.jobUid);
    },
    createNewJob() {
      localStorage.removeItem(this.$props.job.jobUid);
      this.$emit("createOrbRefreshJob");
      this.onClose();
    }
  },
  beforeMount() {
    this.refreshJobOrb();
  }
};
</script>

<style lang="stylus" scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>