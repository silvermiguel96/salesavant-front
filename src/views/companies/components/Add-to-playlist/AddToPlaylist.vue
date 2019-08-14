<template>
  <v-card class="ma-3">
    <v-card-title>
      <h1 class="display-1">Playlists</h1>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="companyPlaylists.playlistsList"
        class="elevation-1"
        :pagination.sync="pagination"
        :rows-per-page-items="pagination.rowsPerPageItems"
        :total-items="totalItems"
        @update:pagination="updatePagination"
      >
        <template v-slot:items="props">
          <td>
          <router-link :to="`/playlists/${props.item.uid}/companies`" >{{ props.item.name || "--"}}</router-link>
          </td>
          <td><v-icon>delete</v-icon></td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
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
        { text: "Action", value: "action" }
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
  apollo: {
    companyPlaylists: {
      query: gql`
        query searchCompanyPlaylists(
          $companyUid: String
          $first: Int
          $offset: Int
        ) {
          companyPlaylists(
            companyUid: $companyUid
            first: $first
            offset: $offset
          ) {
            name
            playlistsList {
              uid
              name
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
    this.$apollo.queries.companyPlaylists;
  }
};
</script>
<style>
</style>
