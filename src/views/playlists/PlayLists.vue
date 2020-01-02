<template>
  <v-container fluid>
    <v-card>
      <v-breadcrumbs
        :large="true"
        :items="[
          {
            text: 'Playlists',
            disabled: false,
            href: '/playlists'
          }
      ]"
        divider=">"
      >
      </v-breadcrumbs>
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
      <ApolloQuery
        :query="require('./graphql/Playlists.gql')"
        :variables="{
          search: this.search,
          first: this.itemsPerPage,
          offset: this.itemsPerPage * this.page - this.itemsPerPage,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder
        }"
        :skip="search.length > 0 && search.length < 2"
      >
        <template slot-scope="{ result: { loading, error, data } }">
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>

          <!-- Error -->
          <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

          <!-- Result -->
          <div v-else-if="data" class="result apollo">
            <!---<div>{{ JSON.stringify(data) }}</div>-->
            <play-lists-table
              v-if="data.playlists.playlistsList"
              :items="data.playlists.playlistsList"
              :totalResults="data.playlists.totalResults"
              class="result apollo"
              @updateOptions="updateOptions"
            ></play-lists-table>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">Loading...</div>
        </template>
      </ApolloQuery>
    </v-card>
  </v-container>
</template>

<script>
import PlayListsTable from "./components/PlayListsTable.vue";
import { mapMutations } from "../../store";

export default {
  data() {
    return {
      items: ["playlists"],
      page: 1,
      itemsPerPage: 10,
      sortBy: "",
      sortOrder: "",
      search: ""
    };
  },
  components: { 
    PlayListsTable 
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.page = page;
      this.itemsPerPage = itemsPerPage;
      if (sortBy.length > 0) {
        switch (sortBy[0]) {
          case "totalScore":
            this.sortBy = "score";
            break;
          case "totalCompanies":
            this.sortBy = "companies";
            break;
        }
      } else {
        this.sortBy = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.sortOrder = "desc";
        } else {
          this.sortOrder = "asc";
        }
      } else {
        this.sortOrder = "";
      }
    },
  }
};
</script>
