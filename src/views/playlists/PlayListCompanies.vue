<template>
  <v-card>
    <!-- TODO: agregar modal de busqueda dentro de una playlist -->
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
    <ApolloQuery
      :query="require('./graphql/PlaylistCompanies.gql')"
      :variables="{ uid: $route.params.playlistId, first: rowsPerPage, offset: (rowsPerPage * page) - rowsPerPage }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <div class="apollo-example">
          <v-breadcrumbs
            v-if="data"
            :items="[
            {
              text: 'Playlists',
              disabled: false,
              href: '/playlists'
            },
            {
              text: playlist.name || $route.params.playlistId,
              disabled: true
            },
            {
              text: 'companies',
              disabled: true
            }
          ]"
            divider=">"
          ></v-breadcrumbs>
          <v-breadcrumbs
            v-else
            :items="[
            {
              text: 'Playlists',
              disabled: false,
              href: '/playlists'
            },
            {
              text: $route.params.playlistId,
              disabled: true
            },
            {
              text: 'companies',
              disabled: true
            }
          ]"
            divider=">"
          ></v-breadcrumbs>
          <v-layout align-center justify-start row fill-height>
            <v-flex xs3 md2>
              <orb-key-words-modal
                v-if="!job"
                :loading="isLoading"
                @createOrbRefreshJob="createOrbRefreshJob"
              />
              <v-btn
                dark
                v-if="!!job"
                @click="showJobModalOrb = !showJobModalOrb"
                color="purple"
              >View results</v-btn>
              <orb-job-modal
                v-if="!!showJobModalOrb"
                :job="job"
                @refreshJob="refreshJob"
                :loading="loadingModal"
                :dialog="showJobModal"
                @onClose="closeJobModal"
                @createOrbRefreshJob="createOrbRefreshJob"
                :canModifySignalName="false"
              />
            </v-flex>
            <v-flex xs3 md2>
              <key-words-modal
                v-if="!job"
                :loading="isLoading"
                @createKeywordsJob="createKeywordsJob"
              />
              <v-btn
                dark
                v-if="!!job"
                @click="showJobModal = !showJobModal"
                color="purple"
              >View keywords</v-btn>
              <job-modal
                v-if="!!showJobModal"
                :job="job"
                @refreshJob="refreshJob"
                :loading="loadingModal"
                :dialog="showJobModal"
                @onClose="closeJobModal"
                @createKeywordsJob="createKeywordsJob"
                :canModifySignalName="false"
              />
            </v-flex>
            <v-flex xs1 md1>
              <playlists-merge :playlist="playlist" />
            </v-flex>
          </v-layout>
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>

          <!-- Error -->
          <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

          <!-- Result -->
          <div v-else-if="data" class="result apollo">
            <!--<pre>{{ JSON.stringify(data) }}</pre>-->
            <companies-table
              v-if="data.companies"
              :items="data.companies"
              @updatePagination="updatePagination"
              class="result apollo"
            ></companies-table>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">Loading...</div>
        </div>
      </template>
    </ApolloQuery>
  </v-card>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
import CompaniesTable from "../../components/companies/CompaniesTable.vue";
import KeyWordsModal from "./components/KeywordsModal.vue";
import OrbKeyWordsModal from "./components/OrbKeywordsModal.vue";
import PlaylistsMerge from "./components/PlaylistMerge.vue";
import JobModal from "./components/JobModal.vue";
import OrbJobModal from "./components/OrbJobModal.vue";

import _get from "lodash.get";
import gql from "graphql-tag";
export default {
  data() {
    return {
      descending: false,
      page: 1,
      rowsPerPage: 25,
      sortBy: "",
      totalItems: 10,
      job: null,
      jobOrb: null,
      loadingModal: false,
      isLoading: false,
      showJobModalOrb: false,
      showJobModal: false,
      snack: false,
      snackColor: "",
      snackText: "",
      playlist: {
        uid: "",
        name: "",
        totalScore: 0,
        description: null
      }
    };
  },
  apollo: {
    playlist: {
      query: gql`
        query getPlaylist($uid: String) {
          playlist(uid: $uid) {
            uid
            name
            totalScore
            description
          }
        }
      `,
      variables() {
        return {
          uid: this.$route.params.playlistId
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  components: {
    CompaniesTable,
    KeyWordsModal,
    JobModal,
    OrbJobModal,
    OrbKeyWordsModal,
    PlaylistsMerge
  },
  methods: {
    updatePagination({
      dataFromEvent: {
        descending = false,
        page = 1,
        rowsPerPage = 5,
        sortBy = "",
        totalItems = 10
      }
    }) {
      this.descending = descending;
      this.page = page;
      this.rowsPerPage = rowsPerPage;
      this.sortBy = sortBy;
      this.totalItems = 5;
    },
    closeJobModal() {
      this.showJobModal = false;
    },
    verifyJobsOrb() {
      const playlistId = _get(this.$route, "params.playlistId", null);
      const jobsOrb = Object.keys(localStorage)
        .filter(key => key.indexOf("job") > -1)
        .map(key => JSON.parse(localStorage[key]));

      console.log("jobs", jobsOrb);

      const existingJob = jobsOrb.find(
        element => element.entityId === playlistId
      );

      console.log("existingJob", existingJob);
      if (existingJob) {
        this.jobsOrb = existingJob;
      } else {
        this.jobsOrb = null;
      }
    },
    verifyJobs() {
      const playlistId = _get(this.$route, "params.playlistId", null);
      const jobs = Object.keys(localStorage)
        .filter(key => key.indexOf("job") > -1)
        .map(key => JSON.parse(localStorage[key]));

      console.log("jobs", jobs);

      const existingJob = jobs.find(element => element.entityId === playlistId);

      console.log("existingJob", existingJob);
      if (existingJob) {
        this.job = existingJob;
      } else {
        this.job = null;
      }
    },
    async refreshJob(jobId = null) {
      const playlistId = _get(this.$route, "params.playlistId", null);
      this.loadingModal = true;
      console.log("playlistcompanies ", "refreshJob ", "jobId ", jobId);
      if (!jobId) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Oops! I can't read this job id";
        return;
      }
      try {
        const result = await fetch(`/jobs/${jobId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage["apollo-token"]}`
          }
        });
        console.log("result.status", result.status);
        if (result.status === 404) {
          this.loadingModal = true;
          return;
        }
        const jsonResult = await result.json();
        console.log("jsonResult", jsonResult);
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
            type: "playlistKeywords",
            status: _get(jsonResult, "status", null),
            progress: _get(jsonResult, "progressPercentage", null),
            results: _get(jsonResult, "payload.keywords", []),
            date: new Date()
          };
        }

        console.log("updatedJob", updatedJob);
        localStorage[jobId] = JSON.stringify(updatedJob);
        this.verifyJobs();
        if (updatedJob.status === "finished") {
          this.loadingModal = false;
        }
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Oops! we did something wrong!";
        console.log("error refreshing job", error);
      }
    },
    async createKeywordsJob() {
      this.isLoading = true;
      console.log("this.$route.params", this.$route.params);
      const playlistId = _get(this.$route, "params.playlistId", null);
      if (!playlistId || playlistId === "undefined") {
        this.isLoading = false;
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Couldn't find the playlist Id, please try later!";
        return;
      }
      if (!!this.isThereAJobForTheSamePlaylist()) {
        this.isLoading = false;
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "There's already a job for this playlist!";
        return;
      }
      const url = "/jobs";
      const data = {
        job_name: "extract_keywords",
        playlist_uid: playlistId,
        max_keywords: 300
      };
      try {
        const result = await fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage["apollo-token"]}`
          }
        });
        const jsonResult = await result.json();
        console.log("jsonResult", jsonResult);
        const jobUid = _get(jsonResult, "job_uid", null);
        console.log("jobUid", jobUid);
        if (!jobUid) {
          this.isLoading = false;
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "Couldn't get a job id, please try later!";
          return;
        }
        const newJob = {
          jobUid,
          type: "playlistKeywords",
          entityId: playlistId,
          progress: 0,
          status: "created",
          results: [],
          date: new Date()
        };
        console.log("newJob", newJob);
        let job = localStorage.getItem(jobUid);
        console.log("job", job);
        if (!job) {
          localStorage.setItem(jobUid, JSON.stringify(newJob));
        } else {
          this.isLoading = false;
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "This Job already exists!";
          return;
        }
        this.isLoading = false;
        this.dialog = false;
        console.log("finish");
        this.verifyJobs();
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Oops we did something wrong!";
        console.log("error creating job to get playlist keywords", error);
      }
    },
    async createOrbRefreshJob() {
      this.isLoading = true;
      console.log("this.$route.params", this.$route.params);
      const playlistId = _get(this.$route, "params.playlistId", null);
      if (!playlistId || playlistId === "undefined") {
        this.isLoading = false;
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Couldn't find the playlist Id, please try later!";
        return;
      }
      if (!!this.isThereAJobForTheSamePlaylistObs()) {
        this.isLoading = false;
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "There's already a job for this playlist!";
        return;
      }
      const url = "/jobs";
      const data = {
        job_name: "refresh_orb",
        playlist_uid: playlistId
      };

      try {
        const result = await fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage["apollo-token"]}`
          }
        });

        const jsonResult = await result.json();
        console.log("jsonResult", jsonResult);

        const jobUid = _get(jsonResult, "job_uid", null);
        console.log("jobUid", jobUid);
        if (!jobUid) {
          this.isLoading = false;
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "Couldn't get a job id, please try later!";
          return;
        }
        const newJob = {
          jobUid,
          type: "refreshOrb",
          entityId: playlistId,
          progress: 0,
          status: "created",
          results: [],
          date: new Date()
        };
        console.log("newJob", newJob);

        let job = localStorage.getItem(jobUid);
        console.log("job", job);
        if (!job) {
          localStorage.setItem(jobUid, JSON.stringify(newJob));
        } else {
          this.isLoading = false;
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "This Job already exists!";
          return;
        }
        this.isLoading = false;
        this.dialog = false;
        console.log("finish");
        this.verifyJobsOrb();
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Oops we did something wrong!";
        console.log("error creating job to get playlist keywords", error);
      }
    },
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
    isThereAJobForTheSamePlaylistObs() {
      const playlistId = _get(this.$route, "params.playlistId", null);
      const jobs = Object.keys(localStorage)
        .filter(key => key.indexOf("job") > -1)
        .map(key => JSON.parse(localStorage[key]));

      console.log("jobs", jobs);

      const existingJob = jobs.find(element => element.entityId === playlistId);

      console.log("existingJob", existingJob);
      return existingJob;
    }
  },
  beforeMount() {
    this.verifyJobs();
  },
  beforeCreate() {
    this.$apollo.query.playlist;
  }
};
</script>

<style scoped>
.form,
.input,
.apollo,
.message {
  padding: 12px;
}

label {
  display: block;
  margin-bottom: 6px;
}

.input {
  font-family: inherit;
  font-size: inherit;
  border: solid 2px #ccc;
  border-radius: 3px;
}

.error {
  color: red;
}

.images {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
  grid-gap: 10px;
}

.image-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  border-radius: 8px;
}

.image {
  max-width: 100%;
  max-height: 100%;
}

.image-input {
  margin: 20px;
}
</style>
