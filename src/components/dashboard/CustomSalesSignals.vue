<template>
  <v-card-text>
    <v-toolbar flat color="white">
      <v-toolbar-title>Custom Signals</v-toolbar-title>
    </v-toolbar>
    <v-row v-if="signals" no-gutters>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="signals.signalsList"
          :server-items-length="signals.totalResults"
          :items-per-page="options.itemsPerPage"
          :options.sync="options"
          @update:options="updateOptions"
          class="mx-2"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>
                <router-link :to="`/signals/${item.id}`">{{ item.name || item.description }}</router-link>
              </td>
              <td>{{item.totalCompanies.toLocaleString() || "0"}}</td>
              <td>{{item.score.toLocaleString() || "0"}}</td>
              <td>{{item.group || "-"}}</td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row justify="center" no-gutters>
      <v-col cols="12">
        <v-progress-linear :active="!!isLoading" color="blue" indeterminate absolute bottom query></v-progress-linear>
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
      headers: [
        {
          text: "Custom Signal",
          value: "customsignal",
          sortable: false,
          width: "20%",
        },
        {
          text: "Count",
          value: "totalCompanies",
          sortable: true,
          width: "20%",
        },
        { text: "Score", value: "score", sortable: true, width: "20%" },
        {
          text: "Group",
          align: "left",
          value: "group",
          sortable: false,
          width: "20%",
        },
      ],
      signals: [],
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc:[],
        apiSortBy: "",
        apiSortOrder: "",
      },
    };
  },
  apollo: {
    signals: {
      query: gql`
        query signals(
          $first: Int
          $offset: Int
          $sortBy: String
          $sortOrder: String
        ) {
          signals(
            first: $first
            offset: $offset
            sortBy: $sortBy
            sortOrder: $sortOrder
          ) {
            totalResults
            signalsList {
              id
              name
              description
              score
              group
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
            this.options.itemsPerPage,
          sortBy: this.options.apiSortBy,
          sortOrder: this.options.apiSortOrder,
        };
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network",
    },
  },
  methods: {
    updateOptions({ page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
      if (sortBy.length > 0) {
        this.options.apiSortBy = sortBy[0];
      } else {
        this.options.apiSortBy = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.options.apiSortOrder = "desc";
        } else {
          this.options.apiSortOrder = "asc";
        }
      } else {
        this.options.apiSortOrder = "";
      }
    },
  },
};
</script>

