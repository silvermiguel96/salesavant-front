<template>
  <v-card-text>
    <v-toolbar flat color="white">
      <v-toolbar-title>Custom Signal Groups</v-toolbar-title>
    </v-toolbar>
    <v-row no-gutters v-if="companySignalsGroupAggs">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="companySignalsGroupAggs.companySignalGroupAggsList"
          :server-items-length="companySignalsGroupAggs.totalResults"
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
                    :to="`/signals?search=&group=${item.signalGroup}&category=&searchType=signals`"
                  >{{ item.signalGroup }}</router-link>
                </td>
                <td>{{ item.totalCompanies.toLocaleString() }}</td>
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
      companySignalsGroupAggs: null,
      headers: [
        {
          text: "Group",
          align: "left",
          value: "group",
          sortable: false,
          width: "50%"
        },
        {
          text: "Total Companies",
          value: "totalCompanies",
          sortable: true,
          width: "50%"
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
    companySignalsGroupAggs: {
      query: gql`
        query companySignalsGroupAggs($first: Int, $offset: Int) {
          companySignalsGroupAggs(first: $first, offset: $offset) {
            totalResults
            companySignalGroupAggsList{
              id
              signalGroup
              creationTime
              totalCompanies
              modificationTime
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
