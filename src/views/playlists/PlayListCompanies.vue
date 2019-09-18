<template>
  <v-container fluid>
    <v-card>
      <!-- TODO: agregar modal de busqueda dentro de una playlist -->
      <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
        {{ snackText }}
        <v-btn text @click="snack = false">Close</v-btn>
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
              disabled: false,
              href: '/companies'
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
            <v-container fluid d-flex flex-wrap class="ma-1">
              <v-flex d-flex xs6 sm3 md2 lg2 xl1 class="ma-1">
                <create-orb-modal
                  v-if="!jobObsRefresh"
                  :loading="isLoading"
                  @createOrbRefreshJob="creationJobs('refresh_orb')"
                />
                <v-btn
                  dark
                  v-if="!!jobObsRefresh"
                  @click="showJobModalOrb = !showJobModalOrb"
                  class="deep-purple darken-3 text-capitalize"
                  small
                >
                  View results
                  <v-icon right small>check</v-icon>
                </v-btn>
                <orb-job-modal
                  v-if="!!showJobModalOrb"
                  :job="jobObsRefresh"
                  @refreshJobOrb="refreshJobForAll()"
                  :loading="loadingModalOrb"
                  :dialog="showJobModalOrb"
                  @onClose="closeOrbJobModal"
                  @createOrbRefreshJob="creationJobs('refreshJob')"
                />
              </v-flex>
              <v-flex d-flex xs5 sm3 md2 lg2 xl1 class="ma-1">
                <key-words-modal
                  v-if="!jobGetKeywords"
                  :loading="isLoading"
                  @createKeywordsJob="creationJobs('extract_keywords')"
                />
                <v-btn
                  v-if="!!jobGetKeywords"
                  @click="showJobModal = !showJobModal"
                  class="deep-purple darken-3 text-capitalize"
                  dark
                  small
                >
                  View keywords
                  <v-icon right small>check</v-icon>
                </v-btn>
                <job-modal
                  v-if="!!showJobModal"
                  :job="jobGetKeywords"
                  @refreshJob="refreshJobForAll('extract_keywords')"
                  :loading="loadingModal"
                  :dialog="showJobModal"
                  @onClose="closeJobModal"
                  @createKeywordsJob="creationJobs('extract_keywords')"
                  :canModifySignalName="false"
                />
              </v-flex>
              <v-flex d-flex xs4 sm2 md2 lg1 xl1 class="ma-1">
                <playlists-merge :playlist="playlist" />
              </v-flex>
            </v-container>
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
                class="result apollo ma-2"
              ></companies-table>
            </div>

            <!-- No result -->
            <div v-else class="no-result apollo">Loading...</div>
          </div>
        </template>
      </ApolloQuery>
    </v-card>
  </v-container>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
import CompaniesTable from "../../components/companies/CompaniesTable.vue";
import KeyWordsModal from "./components/KeywordsModal.vue";
import CreateOrbModal from "./components/CreateOrbModal.vue";
import PlaylistsMerge from "./components/PlaylistMerge.vue";
import JobModal from "./components/JobModal.vue";
import OrbJobModal from "./components/OrbJobModal.vue";

import _get from "lodash.get";
import gql from "graphql-tag";
import { type } from "os";
export default {
  data() {
    return {
      name: "",
      descending: false,
      page: 1,
      rowsPerPage: 25,
      sortBy: "",
      totalItems: 10,
      jobGetKeywords: null,
      jobObsRefresh: null,
      loadingModal: false,
      loadingModalOrb: false,
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
    CreateOrbModal,
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
    closeOrbJobModal() {
      this.showJobModalOrb = false;
    },
    async creationJobs(type) {
      console.log("Empieza la creacion de un  nuevos Jobs");
      console.log("type", type);
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
      if (!!this.isThereAJobForTheSamePlaylistObsForAll(type)) {
        this.isLoading = false;
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "There's already a job for this playlist!";
        return;
      }
      // Creando el Json con el nombre del
      const url = "/jobs";
      const data = {
        job_name: type,
        playlist_uid: playlistId
      };
      console.log("url data", data);
      try {
        //Genera el Fetch con los datos
        const result = await fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage["apollo-token"]}`
          }
        });
        const jsonResult = await result.json();
        // console.log("jsonResult", jsonResult);
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
          type: type,
          entityId: playlistId,
          progress: 0,
          status: "created",
          date: new Date()
        };
        console.log("newJob", newJob);

        // if (type === "refresh_orb") {
        // } else if (type === "extract_keywords") {
        // }
        let job = localStorage.getItem(jobUid);
        console.log("job", job);
        // Si creamos el Job lo asignamos a el localStorage
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
        this.dialogOrb = false;
        console.log("dialogOrb", this.dialogOrb);
        console.log("finish");
        //Verificamos si el Obs que acabas de crear no este registrado
        this.verifyJobsAll(type);
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Oops we did something wrong!";
        console.log("error creating job to get playlist keywords", error);
      }
    },
    isThereAJobForTheSamePlaylistObsForAll(type) {
      // Valida si dentro de el colar Exite un Job para no seguir generando mas Jobs
      const playlistId = _get(this.$route, "params.playlistId", null);
      const jobs = Object.keys(localStorage)
        .filter(key => key.indexOf("job") > -1)
        .map(key => JSON.parse(localStorage[key]));

      console.log("isThereAJobForTheSamePlaylistObsForAll", jobs);

      const existingJob = jobs.find(element => {
        return element.entityId === playlistId && element.type === type;
      });

      console.log("existingJobForAll", existingJob);
      return existingJob;
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
    async refreshJobForAll(jobId = null) {
      console.log('type refreshJobForAll', type);
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
            Authorization: `JWT ${localStorage["apollo-token"]}`
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
            type: "extract_keywords",
            status: _get(jsonResult, "status", null),
            progress: _get(jsonResult, "progressPercentage", null),
            results: _get(jsonResult, "payload.keywords", []),
            date: new Date()
          };
        }

        console.log("updatedJob", updatedJob);
        localStorage[jobId] = JSON.stringify(updatedJob);
        this.verifyJobsAll(type);
        if (updatedJob.status === "finished") {
          this.loadingModal = false;
        }
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Oops! we did something wrong!";
        console.log("error refreshing job", error);
      }
    }
  },
  beforeMount() {
    this.verifyJobsAll("extract_keywords");
    this.verifyJobsAll("refresh_orb");
  },
  beforeCreate() {
    this.$apollo.query.playlist;
  }
};
</script>
