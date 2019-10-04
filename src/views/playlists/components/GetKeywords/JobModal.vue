<template>
  <v-layout row>
    <v-dialog v-model="dialog" persistent max-width="1000">
      <v-card>
        <v-card-title class="headline">Keywords Job</v-card-title>
        <v-card-text>
          <div class="text-center">
            <v-progress-circular v-show="loading" :size="60" indeterminate color="primary"></v-progress-circular>
          </div>
          <p>
            <strong>Status:</strong>
            {{job.status}}
          </p>
          <v-progress-linear v-model="job.progress" height="25" class="white--text" reactive>
            <strong>{{ Math.ceil(job.progress) }}%</strong>
          </v-progress-linear>

          <v-data-table
            v-if="!!job && job.status === 'finished' && !!results.length"
            :headers="headers"
            :items="results"
            class="elevation-1"
            :rows-per-page-items="[100]"
          >
            <template v-slot:items="props">
              <td v-show="!props.item.showSave">{{ props.item.name || ""}}</td>
              <td v-show="!props.item.showSave">{{ props.item.total || "" }}</td>
              <td v-show="!props.item.showSave">{{ props.item.score || "" }}</td>
              <td>
                <table>
                  <tr>
                    <td>
                      <v-icon v-show="!props.item.showSave" @click="toggleSave(props.index)">save</v-icon>
                      <v-icon
                        v-show="props.item.showSave"
                        @click="toggleSave(props.index)"
                      >exit_to_app</v-icon>
                    </td>
                    <td v-if="props.item.showSave">
                      <signal
                        :score="props.item.score || ''"
                        :name="props.item.name || ''"
                        :canModifySignalName="false"
                        :jobUid="job.jobUid || ''"
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="onClose">Close</v-btn>
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
      const results = _get(this.$props.job, "results.keywords", []);
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