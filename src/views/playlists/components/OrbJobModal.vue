<template>
  <v-layout row>
    <v-dialog v-model="dialog" persistent max-width="1000">
      <v-card>
        <v-card-title class="headline">Orb</v-card-title>
        <v-card-text>
          <div class="text-xs-center">
            <v-progress-circular v-show="loading" :size="50" indeterminate color="primary"></v-progress-circular>
          </div>
          <div>
            <ul>
              <li>Job: {{job.jobUid || ""}}</li>
              <li>Status: {{job.status}}</li>
              <li>Type: {{job.type}}</li>
              <li>Progress: {{job.progress}}%</li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" flat @click="createNewJob">Create new ORB</v-btn>
          <v-btn v-show="!results.length" color="green" flat @click="refreshJob">Refresh results</v-btn>
          <v-btn color="error" flat @click="onClose">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import _get from "lodash.get";
import { setTimeout } from "timers";
import Signal from "./PlaylistSignalTable.vue";
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
      ],
      results: []
    };
  },
  props: {
    job: { type: Object, required: true },
    loading: { type: Boolean, default: false },
    dialog: { type: Boolean, default: false },
    canModifySignalName: { type: Boolean, default: false }
  },
  components: { Signal },
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
    getResults() {
      const results = _get(this.$props.job, "results", []);
      this.results = results.map(item => ({
        showSave: false,
        name: item[0] || "",
        total: item[1] || "--",
        score: item[2] || "--"
      }));
    },
    toggleSave(resultIndex) {
      if (!!this.results[resultIndex]) {
        this.results[resultIndex].showSave = !this.results[resultIndex]
          .showSave;
      }
    },
    refreshJob() {
      this.$emit("refreshJob", this.$props.job.jobUid);
    },
    createNewJob() {
      localStorage.removeItem(this.$props.job.jobUid);
      this.$emit("createKeywordsJob");
      this.onClose();
    }
  },
  beforeUpdate() {
    this.getResults();
  },
  beforeMount() {
    this.refreshJob();
  }
};
</script>

<style lang="stylus" scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>