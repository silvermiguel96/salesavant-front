<template>
  <v-layout row>
    <v-dialog v-model="dialog" persistent max-width="1000">
      <v-card>
        <v-card-title class="headline">Orb job</v-card-title>
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
          <v-btn color="error" text @click="onClose">Close</v-btn>
          <v-btn color="green" text @click="createNewJob">Create new ORB</v-btn>
          <v-btn color="green" text @click="refreshJobOrb">Refresh results</v-btn>
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
      ],
    };
  },
  props: {
    job: { type: Object, required: true },
    loading: { type: Boolean, default: false },
    dialog: { type: Boolean, default: false },
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