<template>
  <v-card>
    <ApolloQuery
      :query="require('./graphql/PlaylistCompanies.gql')"
      :variables="{ uid: $route.params.playlistId }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <div class="apollo-example">
          <v-breadcrumbs
            v-if="data && data.playlist"
            :items="[
            {
              text: 'Playlists',
              disabled: false,
              href: '/playlists'
            },
            {
              text: data.playlist.name || data.playlist.uid,
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

          <key-words-modal v-if="!job" :loading="isLoading" @createKeywordsJob="createKeywordsJob" />
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
          />

          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>

          <!-- Error -->
          <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

          <!-- Result -->
          <div v-else-if="data" class="result apollo">
            <!-- <pre>{{ JSON.stringify(data) }}</pre> -->
            <companies-table
              v-if="data.playlist.companies.length"
              :items="data.playlist.companies"
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
import JobModal from "./components/JobModal.vue";
import _get from "lodash.get";
export default {
  data() {
    return {
      job: null,
      loadingModal: false,
      isLoading: false,
      showJobModal: false
    };
  },
  components: { CompaniesTable, KeyWordsModal, JobModal },
  methods: {
    closeJobModal() {
      this.showJobModal = false;
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
        this.loadingModal = false;
        this.showError = true;
        this.errorMessage = "Oops! we did something wrong!";
        setTimeout(() => {
          this.showError = false;
        }, 5000);
        console.log("error refreshing job", error);
      }
    },
    async createKeywordsJob() {
      this.isLoading = true;
      console.log("this.$route.params", this.$route.params);
      const playlistId = _get(this.$route, "params.playlistId", null);
      if (!playlistId || playlistId === "undefined") {
        this.isLoading = false;
        this.showError = true;
        this.errorMessage = "Couldn't find the playlist Id, please try later!";
        setTimeout(() => {
          this.showError = false;
        }, 5000);
        return;
      }
      if (!!this.isThereAJobForTheSamePlaylist()) {
        this.isLoading = false;
        this.showError = true;
        this.errorMessage = "There's already a job for this playlist!";
        setTimeout(() => {
          this.showError = false;
        }, 5000);
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
          this.showError = true;
          this.errorMessage = "Couldn't get a job id, please try later!";
          setTimeout(() => {
            this.showError = false;
          }, 5000);
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
          this.showError = true;
          this.errorMessage = "This Job already exists!";
          setTimeout(() => {
            this.showError = false;
          }, 5000);
          return;
        }
        this.isLoading = false;
        this.showSucess = false;
        this.showError = false;
        this.dialog = false;
        console.log("finish");
        this.verifyJobs();
      } catch (error) {
        this.showError = true;
        this.errorMessage = "Oops we did something wrong!";
        setTimeout(() => {
          this.showError = false;
        }, 5000);
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
    }
  },
  beforeMount() {
    this.verifyJobs();
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
