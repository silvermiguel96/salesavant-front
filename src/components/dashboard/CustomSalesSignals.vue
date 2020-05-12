<template>
  <!-- Custom Sales Signals -->
  <v-card-text>
    <v-toolbar flat color="white">
      <v-toolbar-title>Custom Sales Signals</v-toolbar-title>
    </v-toolbar>
    <v-row no-gutters v-if="companySignalsAggs">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="companySignalsAggs.companySignalAggsList"
          :server-items-length="companySignalsAggs.totalResults"
          :items-per-page="options.itemsPerPage"
          :sort-by="['totalCompanies']"
          :sort-desc="[true]"
          :options.sync="options"
          class="mx-2"
          @updateOptions="updateOptions"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>
                <router-link
                  :to="`/signals/${item.signal.id}`"
                >{{ item.signal.name || item.signal.description }}</router-link>
              </td>
              <td>{{item.totalCompanies.toLocaleString() || "0"}}</td>
              <td>{{item.signal.defaultScore.toLocaleString() || "0"}}</td>
              <td>{{item.signal.group || "-"}}</td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row justify="center" no-gutters>
      <v-col cols="12">
        <v-progress-linear
          :active="!!isLoading"
          color="blue"
          indeterminate
          absolute
          bottom
          query
        ></v-progress-linear>
      </v-col>
    </v-row>
  </v-card-text>
</template>
<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      isLoading: true,
      companySignalsAggs: null,
      headers: [
        {
          text: "Custom Signal",
          value: "customsignal",
          sortable: false,
          width: "20%"
        },
        {
          text: "Count",
          value: "totalCompanies",
          sortable: true,
          width: "20%"
        },
        { text: "Score", value: "score", sortable: false, width: "20%" },
        {
          text: "Group",
          align: "left",
          value: "group",
          sortable: false,
          width: "20%"
        }
      ],
      descending: false,
      options: {
        page: 1,
        itemsPerPage: 10
      },
      sortBy: "",
      isFiltered: false
    };
  },
  apollo: {
    companySignalsAggs: {
      query: gql`
        query companySignalsAggs($first: Int, $offset: Int) {
          companySignalsAggs(first: $first, offset: $offset) {
            totalResults
            companySignalAggsList {
              signal {
                id
                name
                description
                defaultScore
                group
              }
              totalCompanies
            }
          }
        }
      `,
      variables() {
        return {
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage
        };
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network"
    }
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = options.page;
      this.options.itemsPerPage = options.itemsPerPage;
    }
  }
};
</script>

