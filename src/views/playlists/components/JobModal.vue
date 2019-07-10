<template>
  <v-layout row>
    <v-dialog v-model="dialog" persistent max-width="1000">
      <v-card>
        <v-card-title class="headline">Keywords Job</v-card-title>
        <v-alert :value="showError" dismissible type="error">{{errorMessage}}</v-alert>
        <v-alert :value="showSuccess" dismissible type="success">{{successMessage}}</v-alert>
        <v-card-text>
          <v-data-table
            v-if="!!job && job.status === 'finished' && !!results.length"
            :headers="headers"
            :items="results"
            class="elevation-1"
            :rows-per-page-items="[100]"
          >
            <template v-slot:items="props">
              <td v-show="!props.item.showSave">{{ props.item.name || ""}}</td>
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
                      <signal :score="props.item.score || ''" :name="props.item.name || ''" />
                    </td>
                  </tr>
                </table>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!--<v-btn color="success" flat @click="getPlaylistKeyWords">Start process</v-btn>-->
          <h1 v-show="loading">Loading...</h1>
          <v-btn color="green" flat @click="createNewJob">Create new keyword results (process again)</v-btn>
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
import Signal from "../../signals/components/Signal.vue";
export default {
  data() {
    return {
      showError: false,
      errorMessage: "",
      showSuccess: false,
      successMessage: "",
      headers: [
        {
          text: "Keyword",
          align: "left",
          sortable: false
        },
        { text: "Score", align: "left", sortable: false },
        { text: "Actions", align: "left", sortable: false }
      ],
      results: []
    };
  },
  props: {
    job: { type: Object, required: true },
    loading: { type: Boolean, default: false },
    dialog: { type: Boolean, default: false }
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
      this.results = results.map(i => ({
        showSave: false,
        name: Object.keys(i)[0] || "",
        score: i[Object.keys(i)[0]] || "0"
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