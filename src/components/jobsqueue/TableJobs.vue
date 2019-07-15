<template>
  <v-card>
    <v-card-text>
      <!--TODO: cambiar v-aler por v-snackbar -->
      <v-alert :value="showError" dismissible type="error">{{errorMessage}}</v-alert>
      <v-alert :value="showSuccess" dismissible type="success">{{successMessage}}</v-alert>
      <template>
        <v-btn class="warning" @click.prevent="clearAll">
          Clear all
          <v-icon right>clear_all</v-icon>
        </v-btn>
        <v-data-table :headers="headers" :items="jobs" class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.jobUid }}</td>
            <td>{{ props.item.type }}</td>
            <td>{{ props.item.entityId }}</td>
            <td>{{ props.item.progress }}%</td>
            <td>{{ props.item.status }}</td>
            <td>{{ props.item.date }}</td>
            <td>
              <v-icon @click="deleteItem(props.item.jobUid)">delete</v-icon>
              <v-icon @click="verifyJobStatus(props.item.jobUid)">refresh</v-icon>
            </td>
            <td v-if="props.item.status === 'finished'">
              <a :href="`/playlists/${props.item.entityId}/companies`">view results</a>
            </td>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="loadJobs">Reload Jobs</v-btn>
          </template>
        </v-data-table>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import { setTimeout } from "timers";
import _get from "lodash.get";
import { stringify } from "querystring";
export default {
  data() {
    return {
      headers: [
        { text: "Job uid", sortable: false, value: "jobUid" },
        { text: "Job Type", value: "type" },
        { text: "Entity Id", value: "entityId" },
        { text: "Progress ", value: "progress" },
        { text: "Status", value: "status" },
        { text: "Date", value: "date" },
        { text: "Actions", value: "name", sortable: false },
        { text: "View", value: "view", sortable: false }
      ],
      jobs: [],
      showError: false,
      showSuccess: false,
      errorMessage: "",
      successMessage: ""
    };
  },
  methods: {
    loadJobs() {
      const jobs = Object.keys(localStorage)
        .filter(key => key.indexOf("job") > -1)
        .map(key => JSON.parse(localStorage[key]))
        .sort((a, b) => (a.date < b.date ? 1 : -1));
      console.log("jobs", jobs);

      this.jobs = [...jobs];
    },
    async verifyJobStatus(jobId = null) {
      if (!jobId) {
        this.showError = true;
        this.errorMessage = "Oops! I can't read this job id";
        setTimeout(() => {
          this.showError = false;
        }, 5000);
        return;
      }
      try {
        const result = await fetch(`/jobs/${jobId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage["apollo-token"]}`
          }
        });
        const jsonResult = await result.json();
        console.log("jsonResult", jsonResult);
        let updatedJob = JSON.parse(localStorage[jobId]);
        updatedJob = {
          ...updatedJob,
          status: _get(jsonResult, "status", null),
          progress: _get(jsonResult, "progressPercentage", null),
          results: _get(jsonResult, "payload.keywords", []),
          date: new Date()
        };
        console.log("updatedJob", updatedJob);
        localStorage[jobId] = JSON.stringify(updatedJob);
        this.loadJobs();
      } catch (error) {
        this.showError = true;
        this.errorMessage = "Oops! we did something wrong!";
        setTimeout(() => {
          this.showError = false;
        }, 5000);
        console.log("error refreshing job", error);
      }
    },
    deleteItem(item) {
      const index = item;
      localStorage.removeItem(index);
      console.log(`The uid: ${index}  was successfully deleted!`);
      this.loadJobs();
    },
    clearAll() {
      this.jobs.forEach(element => {
        console.log(Element.jobUid);
        localStorage.removeItem(element.jobUid);
        console.log(`The uid: ${element.jobUid}  was successfully deleted!`);
        this.loadJobs();
      });
    }
  },
  created() {
    this.loadJobs();
  }
};
</script>

<style>
</style>
