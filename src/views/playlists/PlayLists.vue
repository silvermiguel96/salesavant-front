<template>
  <v-container fluid>
    <v-card>
      <div class="apollo-example">
        <v-breadcrumbs
          :large="true"
          v-if="!!this.$route.query && !!this.$route.query.searchType"
          :items="[
           {
             text: 'Playlists',
             disabled: false,
             href: '/playlists'
           },
           {
             text: `${this.$route.query.searchType} search`,
             disabled: true,
             href: '/playlists'
           }
        ]"
          divider=">"
        ></v-breadcrumbs>
        <v-breadcrumbs
          v-else
          :large="true"
          :items="[
           {
             text: 'Playlists',
             disabled: true,
             href: '/news'
          }
          ]"
          divider=">"
        ></v-breadcrumbs>
        <template
          v-if="
            !!this.advancedSearch.searchType &&
              this.advancedSearch.searchType == 'playlists'
          "
        >
          <v-container fluid class="mx-1">
            <v-row no-gutters>
              <v-col cols="12">
                <div class="mt-6">
                  <span class="ml-2">Filtering by: </span>
                  <v-chip
                    v-for="(value, key) in playlistSearchFilters"
                    :key="key"
                    class="mx-1 text-capitalize"
                    style="padding: 0 8px;"
                    color="blue-grey"
                    @click:close="removeFilter(key)"
                    outlined
                    close
                    small
                    ><strong>{{ key }}:&nbsp;</strong>{{ value }}</v-chip
                  >
                </div>
              </v-col>
            </v-row>
          </v-container>
          <ApolloQuery
            :query="require('./graphql/PlaylistSearch.gql')"
            :variables="{
              ...this.advancedSearch.playlistSearch,
              first: this.itemsPerPage,
              offset: this.itemsPerPage * this.page - this.itemsPerPage,
            }"
          >
            <template slot-scope="{ result: { loading, error, data } }">
              <div v-if="loading" class="loading apollo">Loading...</div>

              <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

              <!-- Result -->
              <div v-else-if="data" class="result apollo">
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
        </template>
        <template v-else>
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
          <!-- Apollo watched Graphql query -->
          <ApolloQuery
            :query="require('./graphql/Playlists.gql')"
            :variables="{
              search: this.search,
              first: this.itemsPerPage,
              offset: this.itemsPerPage * this.page - this.itemsPerPage,
              sortBy: this.sortBy,
              sortOrder: this.sortOrder
            }"
            :skip="search.length > 0 && search.length <= 2"
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
        </template>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import _pickby from "lodash.pickby";
import PlayListsTable from "./components/PlayListsTable.vue";
import {defaultPlaylistSearch} from "../../store";

export default {
  data() {
    return {
      items: ["playlists"],
      page: 1,
      itemsPerPage: 10,
      sortBy: "",
      sortOrder: "",
      isFiltered: false,
      search: ""
    };
  },
  props: {
    showSearch: { type: Boolean, default: false }
  },
  components: { PlayListsTable },
  methods: {
    removeFilter(key){
      this.$store.commit('doPlaylistsSearch', {...this.$store.state.advancedSearch.playlistSearch, [key]: defaultPlaylistSearch[key]})
    },
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
  },
  computed: {
    advancedSearch() {
      return this.$store.state.advancedSearch;
    },
    playlistSearchFilters(){
      return _pickby(this.advancedSearch.playlistSearch);
    }
  }
};
</script>
