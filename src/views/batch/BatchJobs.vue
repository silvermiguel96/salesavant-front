<template>
  <v-container fluid>
    <v-snackbar bottom v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-card>
      <v-breadcrumbs
        :large="true"
        :items="[
            {
              text: 'Jobs',
              disabled: true
            },
          ]"
        divider=">"
      ></v-breadcrumbs>
      <v-container fluid class="mx-1">
        <v-row no-gutters class="ml-2">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Filter"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <div>
        <!-- Result -->
        <div v-if="items" class="result">
          <jobs-table
            v-if="items"
            :items="this.items"
            :totalResults="this.totalResults"
            @updateOptions="updateOptions"
          ></jobs-table>
        </div>
        <div v-else class="no-result">Loading...</div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import { setTimeout } from "timers";
import JobsTable from "./components/BatchJobsTable.vue";

export default {
  data() {
    return {
      items: [],
      totalResults: 0,
      page: 1,
      itemsPerPage: 10,
      search: "",
      snack: false,
      snackColor: "",
      snackText: ""
    };
  },
  methods: {
    updateOptions({ dataFromEvent: { page = 1, itemsPerPage = 10 } }) {
      this.page = page;
      this.itemsPerPage = itemsPerPage;
      this.loadData()
    },
    loadData: function() {
      const salesavantJobs = gql`
        query getAllJobs($first: Int, $offset: Int) {
          salesavantJobs(first: $first, offset: $offset) {
            totalResults
            salesavantJobsList {
              uid
              creationTime
              modificationTime
              jobType
              description
              progress
              result
              status
              additionalData
            }
          }
        }
      `;

      this.$apollo
        .query({
          query: salesavantJobs,
          variables: {
            first: this.itemsPerPage,
            offset: this.itemsPerPage * this.page - this.itemsPerPage
          },
          fetchPolicy: "no-cache"
        })
        .then(resp => {
          if (!!resp.data && !!resp.data.salesavantJobs) {
            this.totalResults = resp.data.salesavantJobs.totalResults;
            this.items = resp.data.salesavantJobs.salesavantJobsList;
          }
        });
    }
  },
  props: {
    showSearch: { type: Boolean, default: false }
  },
  components: {
    JobsTable
  },
  mounted: function() {
    this.loadData();
    this.interval = setInterval(function() {
        this.loadData();
      }.bind(this), 3000);
  },
  beforeDestroy: function() {
    clearInterval(this.interval);
  }
};
</script>
