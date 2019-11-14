<template>
  <v-container fluid>
    <v-card>
      <v-snackbar bottom v-model="snack" :timeout="10000" :color="snackColor">
        {{ snackText }}
        <v-btn text @click="snack = false">Close</v-btn>
      </v-snackbar>
      <v-breadcrumbs
        :large="true"
        :items="[
            {
              text: 'Playlists',
              disabled: false,
              href: '/playlists'
            },
            {
              text: playlist.name || $route.params.playlistUID,
              disabled: true
            }
          ]"
        divider=">"
      ></v-breadcrumbs>
      <v-container fluid class="mx-1">
        <v-row no-gutters>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Filter"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8">
            <div class="d-flex justify-md-end">
              <div class="mt-2 mr-2">
                <job-modal :jobType="'ORBRefresh'" :additionalData="{}">
                  <template v-slot:label>
                    <v-icon size="18" class="mr-2">cloud_download</v-icon>Export
                  </template>
                  <template v-slot:title>Export as CSV</template>
                  <template v-slot:content>Export companies Data</template>
                </job-modal>
              </div>
              <div class="mt-2 mr-2">
                <jobs-menu
                  :items="[
                    {
                      title: 'Companies',
                      icon: 'update',
                      callback: () => {
                        this.createJob('OrbRefresh');
                      }
                    },
                    {
                      title: 'Keywords',
                      icon: 'update',
                      callback: () => {
                        this.createJob('KeywordsRefresh');
                      }
                    },
                    {
                      title: 'Contacts',
                      icon: 'update',
                      callback: () => {
                        this.createJob('ContactsRefresh');
                      }
                    }
                  ]"
                >
                  <template v-slot:label>Refresh</template>
                </jobs-menu>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <ApolloQuery
        :query="require('./graphql/PlaylistCompanies.gql')"
        :variables="{ 
          uid: $route.params.playlistUID, 
          first: rowsPerPage, offset: (rowsPerPage * page) - rowsPerPage 
        }"
      >
        <template slot-scope="{ result: { loading, error, data } }">
          <div class="apollo-example">
            <!-- Loading -->
            <div v-if="loading" class="loading apollo">Loading...</div>

            <!-- Error -->
            <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

            <!-- Result -->
            <div v-else-if="data" class="result apollo">
              <!--<pre>{{ JSON.stringify(data) }}</pre>-->
              <companies-table
                v-if="data.playlistCompanies.companiesList"
                :items="data.playlistCompanies.companiesList"
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
import JobModal from "../../components/jobs/JobModal.vue";
import JobsMenu from "../../components/jobs/JobsMenu.vue";

// ExportCompanies

import ExportCompaniesModal from "./components/ExportCompanies/ExportCompaniesModal.vue";
import JobExportModal from "./components/ExportCompanies/JobExportCompaniesModal.vue";

import _get from "lodash.get";
import gql from "graphql-tag";
export default {
  components: {
    CompaniesTable,
    JobModal,
    JobsMenu
  },
  data() {
    return {
      name: "",
      descending: false,
      page: 1,
      rowsPerPage: 25,
      sortBy: "",
      totalItems: 10,
      loadingModal: false,
      isLoading: false,
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
          uid: this.$route.params.playlistUID
        };
      },
      fetchPolicy: "cache-and-network"
    }
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
    async createJob(jobType) {
      this.$emit("createJob", {
        jobType: jobType,
        description: "test",
        additionalData: { playlist_uid: this.playlist.uid }
      });
      this.snack = true;
      this.snackText = `Job ${jobType} enqueed successfully`;
      this.snackColor = "success";
    }
  },
  beforeCreate() {
    this.$apollo.query.playlist;
  }
};
</script>
