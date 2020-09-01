<template>
  <v-container fluid>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="12" sm="3" md="3" lg="2" class="pa-1">
          <v-btn class="text-capitalize" block color="primary" min-width="150" to="/launch-job">
            <v-icon size="18" class="mr-2">add</v-icon>new scheduled job
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
              autocomplete="off"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </v-row>
    </v-container>
    <!-- Result -->
    <div v-if="salesavantScheduledJobs" class="result">
      <scheduled-jobs-table
        v-if="salesavantScheduledJobs"
        :items="this.salesavantScheduledJobs.salesavantJobsList"
        :totalResults="this.salesavantScheduledJobs.totalResults"
        @updateOptions="updateOptions"
        @delete-scheduled-job="deleteScheduledJob"
      ></scheduled-jobs-table>
    </div>
    <div v-else class="no-result">Loading...</div>
  </v-container>
</template>
<script>
import gql from "graphql-tag";
import { setTimeout } from "timers";
import ScheduledJobsTable from "../../batch/ScheduledJobsTable.vue";

export default {
  data() {
    return {
      totalResults: 0,
      page: 1,
      itemsPerPage: 10,
      search: "",
      salesavantScheduledJobs: {
        salesavantJobsList: [],
        totalResults: 0,
      },
    };
  },
  apollo: {
    salesavantScheduledJobs: {
      query: gql`
        query salesavantScheduledJobs(
          $search: String
          $first: Int
          $offset: Int
        ) {
          salesavantScheduledJobs(
            search: $search
            first: $first
            offset: $offset
          ) {
            totalResults
            salesavantJobsList {
              uid
              jobType
              modificationTime
              description
              rqJobId
              additionalData
              scheduleTime
              periodicity
              cron
              count
              lastResult
              accountId
              userId
            }
          }
        }
      `,
      variables() {
        return {
          search: this.search.length >= 3 ? this.search : "",
          first: this.itemsPerPage,
          offset: this.itemsPerPage * this.page - this.itemsPerPage,
        };
      },
      skip() {
        return this.search.length > 0 && this.search.length < 2;
      },
    },
  },
  methods: {
    updateOptions({ dataFromEvent: { page = 1, itemsPerPage = 10 } }) {
      this.page = page;
      this.itemsPerPage = itemsPerPage;
    },
    async deleteScheduledJob(item, index) {
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($jobUid: String!) {
            deleteScheduledJob(jobUid: $jobUid) {
              status
              message
            }
          }
        `,
        variables: {
          jobUid: item.uid,
        },
      });
      if (!!result && result.data.status == "ok") {
        this.salesavantScheduledJobs.salesavantJobsList.splice(index, 1);
        this.salesavantScheduledJobs.totalResults =
          this.salesavantScheduledJobs.totalResults - 1;
      }
    },
  },
  components: {
    ScheduledJobsTable,
  },
};
</script>
