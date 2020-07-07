<template>
  <v-container fluid>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12" sm="3" md="3" lg="2" class="pa-1">
            <v-btn class="text-capitalize" block color="primary" min-width="150" to="/launch-job">
              <v-icon size="18" class="mr-2">add</v-icon>new job
            </v-btn>
          </v-col>
          <v-row no-gutters class="d-flex justify-end">
            <v-col cols="12" sm="6" md="6" lg="6" class="pa-1">
              <v-text-field
                v-model="search"
                append-icon="filter_list"
                label="Quick Search"
                hide-details
                placeholder="Type a Job Name or Description"
                @change="onSearch"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
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
  </v-container>
</template>
<script>
import gql from "graphql-tag";
import { setTimeout } from "timers";
import JobsTable from "../../batch/BatchJobsTable.vue";

export default {
  data() {
    return {
      items: [],
      totalResults: 0,
      page: 1,
      itemsPerPage: 10,
      search: ""
    };
  },
  methods: {
    updateOptions({ dataFromEvent: { page = 1, itemsPerPage = 10 } }) {
      this.page = page;
      this.itemsPerPage = itemsPerPage;
      this.loadData();
    },
    loadData: function() {
      const salesavantScheduledJobs = gql`
        query getAllJobs($search: String, $first: Int, $offset: Int) {
          salesavantScheduledJobs(search: $search, first: $first, offset: $offset) {
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
          query: salesavantScheduledJobs,
          variables: {
            search: this.search.length >= 3 ? this.search : "",
            first: this.itemsPerPage,
            offset: this.itemsPerPage * this.page - this.itemsPerPage
          },
          fetchPolicy: "no-cache"
        })
        .then(resp => {
          if (!!resp.data && !!resp.data.salesavantScheduledJobs) {
            this.totalResults = resp.data.salesavantScheduledJobs.totalResults;
            this.items = resp.data.salesavantScheduledJobs.salesavantJobsList;
          }
        });
    },
    onSearch: function() {
      console.log("onSearch");
      this.loadData();
    }
  },
  props: {},
  components: {
    JobsTable
  },
  mounted: function() {
    this.loadData();
    this.interval = setInterval(
      function() {
        this.loadData();
      }.bind(this),
      3000
    );
  },
  beforeDestroy: function() {
    clearInterval(this.interval);
  }
};
</script>
