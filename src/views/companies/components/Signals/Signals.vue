<template>
  <v-card class="ma-3">
    <v-card-title>
      <h1 class="display-1">Signals</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="companySignals"
        :items-per-page="pagination.rowsPerPage"
        :footer-props="{
          'items-per-page-options': pagination.rowsPerPageItems
        }"
        class="elevation-1"
        :server-items-length="totalItems"
      >
        <template v-slot:item="{ item, headers }">
          <tr>
            <td>
              <router-link :to="`/signals/${item.signal.id}`">{{ item.signal.name || "--"}}</router-link>
            </td>
            <td>{{ item.signal.description || "--"}}</td>
            <td>{{ item.signal.group || "--"}}</td>
            <td>{{ item.signal.category || "--"}}</td>
            <td>{{ item.signal.defaultScore || "0"}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import LongParagraph from "../../../../components/companies/LongParagraph.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 25,
        rowsPerPageItems: [25, 50, 100]
      },
      companySignals: [],
      descending: false,
      sortBy: "",
      totalItems: 10000000,
      headers: [
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
        { text: "Group", value: "group" },
        { text: "Category", value: "category" },
        { text: "Default Score", value: "defaultScore" }
      ]
    };
  },
  methods: {
    updatePagination({
      dataFromEvent: {
        descending = false,
        page = 1,
        rowsPerPage = 5,
        sortBy = "",
        totalItems = 10000000
      }
    }) {
      this.descending = descending;
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.sortBy = sortBy;
      this.totalItems = totalItems;
    }
  },
  components: {
    LongParagraph
  },
  apollo: {
    companySignals: {
      query: gql`
        query searchCompanyPlaylist(
          $companyUid: String
          $first: Int
          $offset: Int
        ) {
          companySignals(
            companyUid: $companyUid
            first: $first
            offset: $offset
          ) {
            signal {
              id
              name
              description
              group
              category
              defaultScore
            }
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid,
          first: this.pagination.rowsPerPage,
          offset:
            this.pagination.rowsPerPage * this.pagination.page -
            this.pagination.rowsPerPage
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  beforeUpdate() {
    this.$apollo.queries.companySignals;
  }
};
</script>
<style>
</style>
