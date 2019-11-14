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
      <v-row no-gutters class="ml-2">
          <v-col cols="12" md="4">
            <v-text-field v-model="search" append-icon="search" label="Filter" single-line hide-details></v-text-field>
          </v-col>
      </v-row>
      <div>
        <ApolloQuery
          :query="require('./graphql/Jobs.gql')"
          :variables="{
              first: this.itemsPerPage, 
              offset: (this.itemsPerPage * this.page) - this.itemsPerPage
            }"
        >
          <template slot-scope="{ result: { loading, error, data } }">
            <!-- Loading -->
            <div v-if="loading" class="loading apollo">Loading...</div>

            <!-- Error -->
            <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

            <!-- Result -->
            <div v-else-if="data" class="result apollo">
              <jobs-table
                v-if="data.salesavantJobs.salesavantJobsList.length"
                :items="data.salesavantJobs.salesavantJobsList"
                :totalResults="data.salesavantJobs.totalResults"
                class="result apollo"
                @updateOptions="updateOptions"
              ></jobs-table>
            </div>

            <div v-else class="no-result apollo">Loading...</div>
          </template>
        </ApolloQuery>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import JobsTable from "./components/JobsTable.vue";
export default {
  data() {
    return {
      items: [],
      page: 1,
      itemsPerPage: 10
    };
  },
  props: {
    showSearch: { type: Boolean, default: false }
  },
  components: {
    JobsTable
  },
  methods: {
    updateOptions({ dataFromEvent: { page = 1, itemsPerPage = 10 } }) {
      this.page = page;
      this.itemsPerPage = itemsPerPage;
    }
  }
};
</script>
