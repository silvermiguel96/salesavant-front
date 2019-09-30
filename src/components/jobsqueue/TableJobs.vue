<template>
  <v-card>
    <v-card-text>
      <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
        {{ snackText }}
        <v-btn text @click="snack = false">Close</v-btn>
      </v-snackbar>
      <template>
        <v-btn class="warning text-capitalize" small @click.prevent="clearAll">
          <v-icon small>clear_all</v-icon>clear all
        </v-btn>
        <v-data-table :headers="headers" :items="jobs" class="elevation-2 mt-2">
          <template v-slot:item="{ item, header}">
            <tr>
              <td>{{ item.jobUid }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.entityId }}</td>
              <td>{{ item.progress }}%</td>
              <td>{{ item.status }}</td>
              <td>{{ item.date }}</td>
              <td>
                <v-icon @click="deleteItem( item.jobUid)">delete</v-icon>
                <v-icon @click="verifyJobStatus(item.jobUid, item.type)">refresh</v-icon>
              </td>
              <td v-if="item.status === 'finished'">
                <v-btn small class="success text--white text-capitalize" dark>
                  <a
                    class="white--text"
                    :href="`/playlists/${ item.entityId}/companies`"
                  >view results</a>
                </v-btn>
              </td>
              <td v-else>
                <v-btn loading></v-btn>
              </td>
            </tr>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary ma-3" small class="text-capitalize" @click="loadJobs">
              <v-icon small>settings_backup_restore</v-icon>Reload Jobs
            </v-btn>
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
      snack: false,
      snackColor: "",
      snackText: ""
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
    verifyJobStatus(jobId, type) {
      const result = setInterval(() => {
        this.loadingModal = true;
        console.log("type refreshJobForAll", type);
        const playlistId = _get(this.$route, "params.playlistId", null);
        console.log("playlistcompanies ", "refreshJob ", "jobId ", jobId);
        if (!jobId) {
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "Oops! I can't read this job id";
          return;
        }
        try {
          function status(response) {
            if (response.status >= 200 && response.status < 300) {
              return Promise.resolve(response);
            } else {
              return Promise.reject(new Error(response.statusText));
            }
          }

          fetch(`http://localhost:4000/jobs/${jobId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage["apollo-token"]}`
            }
          })
            // .then(status)
            .then(response => {
              return response.json();
            })
            .then(jsonResult => {
              console.log("Request succeeded with JSON response", jsonResult);
              console.log("jsonResult.status", jsonResult.status);
              if (jsonResult.status === 404) {
                this.loadingModal = true;
              }
              let updatedJob = {};
              if (localStorage[jobId]) {
                updatedJob = JSON.parse(localStorage[jobId]);
                updatedJob = {
                  ...updatedJob,
                  status: _get(jsonResult, "status", null),
                  progress: _get(jsonResult, "progressPercentage", null),
                  results: _get(jsonResult, "payload.keywords", []),
                  date: new Date()
                };
              } else {
                updatedJob = {
                  entityId: playlistId,
                  type: type,
                  status: _get(jsonResult, "status", null),
                  progress: _get(jsonResult, "progressPercentage", null),
                  results: _get(jsonResult, "payload.keywords", []),
                  date: new Date()
                };
              }

              console.log("updatedJob", updatedJob);
              localStorage[jobId] = JSON.stringify(updatedJob);
              if (updatedJob.status === "finished") {
                clearInterval(result);
                this.loadingModal = false;
              }
              this.verifyJobsAll(type);
              this.loadJobs()
              console.log("jsonResult", jsonResult);
            })
            .catch(function(error) {
              console.log("Request failed", error);
            });
        } catch (error) {
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "Oops! we did something wrong!";
          console.log("error refreshing job", error);
        }
      }, 3000);
    },
    verifyJobsAll(type) {
      const playlistId = _get(this.$route, "params.playlistId", null);
      const jobs = Object.keys(localStorage)
        .filter(key => key.indexOf("job") > -1)
        .map(key => JSON.parse(localStorage[key]));

      console.log("JobsGeneral", jobs);
      console.log("type", type);
      const existingJob = jobs.find(element => {
        return element.entityId === playlistId && element.type === type;
      });

      if (type === "refresh_orb") {
        console.log(
          `Exixting Job All Type: ${type} and Jobs is :`,
          existingJob
        );
        if (existingJob) {
          this.jobObsRefresh = existingJob;
        } else {
          this.jobObsRefresh = null;
        }
        console.log("jobObsRefresh", this.jobObsRefresh);
      } else if (type === "extract_keywords") {
        console.log(
          `Exixting Job All Type: ${type} and Jobs is :`,
          existingJob
        );
        if (existingJob) {
          this.jobGetKeywords = existingJob;
        } else {
          this.jobGetKeywords = null;
        }
        console.log("jobGetKeywords", this.jobGetKeywords);
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
a {
  text-decoration: none;
}
</style>
