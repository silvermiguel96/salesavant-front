<template>
  <v-container fluid>
    <v-card>
      <div class="apollo-example">
        <!-- TODO: cuando cambio el número de registros por página no hace nada -->
        <v-breadcrumbs
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
          :items="[
          {
            text: 'Playlists',
            disabled: true,
            href: '/news'
          }
          ]"
          divider=">"
        ></v-breadcrumbs>
        <h1 class="ml-2 headline text-capitalize" v-if="!!isFiltered">filtering by</h1>
        <ul class="ml-2" v-if="!!isFiltered">
          <li v-if="this.$route.query.playlistsSearch" >Searching playlist with "{{this.$route.query.playlistsSearch}}"</li>
          <li v-if="this.$route.query.lessThanCompanies" >Less than companies "{{this.$route.query.lessThanCompanies}}"</li>
          <li v-if="this.$route.query.moreThanCompanies" >More than companies "{{this.$route.query.moreThanCompanies}}"</li>
        </ul>
        <v-btn color="primary" class="text-capitalize ma-2" dark small @click="toggleSearch">
          <v-icon small class="pr-1">search</v-icon>search
        </v-btn>
        <template v-if="!!this.$route.query && !!this.$route.query.searchType && this.$route.query.searchType === 'playlists' ||
      !!this.$route.query.playlistsSearch || !!this.$route.query.moreThanCompanies || !!this.$route.query.lessThanCompanies"
        >
          <ApolloQuery
            :query="require('./graphql/PlaylistSearch.gql')"
            :variables="{ 
              search: this.$route.query.playlistsSearch,
              lessThanCompanies: Number.parseInt(this.$route.query.lessThanCompanies || 0) , 
              moreThanCompanies: Number.parseInt(this.$route.query.moreThanCompanies) || 0 ,
              first: this.itemsPerPage, 
              offset: (this.itemsPerPage * this.page) - this.itemsPerPage,
              sortBy: this.sortBy,
              sortOrder: this.sortOrder
            }"
          >
            <template slot-scope="{ result: { loading, error, data } }">
              <!-- Loading-->
              <div v-if="loading" class="loading apollo">Loading...</div>

              <!-- Error -->
              <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

              <!-- Result -->
              <div v-else-if="data" class="result apollo">
                <!---<div>{{ JSON.stringify(data) }}</div>-->
                <play-lists-table
                  v-if="data.playlists.playlistsList.length"
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
          <!-- Apollo watched Graphql query -->
          <ApolloQuery
            :query="require('./graphql/Playlists.gql')"
            :variables="{
              first: this.itemsPerPage, 
              offset: (this.itemsPerPage * this.page) - this.itemsPerPage,
              sortBy: this.sortBy,
              sortOrder: this.sortOrder
            }"
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
                  v-if="data.playlists.playlistsList.length"
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
/* import PLAYLISTS from "./Playlists.gql"; */
import PlayListsTable from "./components/PlayListsTable.vue";
export default {
  data() {
    return {
      items: ["playlists"],
      page: 1,
      itemsPerPage: 10,
      sortBy: "",
      sortOrder: "",
      isFiltered: false
    };
  },
  props: {
    showSearch: { type: Boolean, default: false }
  },
  components: { PlayListsTable },
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
          case "totalSignals":
            this.sortBy = "signals";
          case "numEmployees":
            this.sortBy = "employees";
        }
      }else{
        this.sortBy = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.sortOrder = "desc";
        } else {
          this.sortOrder = "asc";
        }
      }else{
        this.sortOrder = "";
      }
    },
    toggleSearch() {
      this.$emit("toggleSearch", {
        show: !this.$props.showSearch,
        expand: 2
      });
    },
    checkIfIsFiltered() {
      let result = false;
      for (let key in this.$route.query) {
        console.log("key", key);
        if (!!this.$route.query[key] && key !== "searchType") {
          result = true;
          break;
        }
      }
      return result;
    }
  },
  beforeMount() {
    this.isFiltered = this.checkIfIsFiltered();
  },
  beforeUpdate() {
    this.isFiltered = this.checkIfIsFiltered();
  },
  updated() {
    this.isFiltered = this.checkIfIsFiltered();
  }
};
</script>
