<template>
  <v-container fluid>
    <v-card>
      <div class="apollo-example">
        <v-breadcrumbs
          v-if="!!this.$route.query && !!this.$route.query.searchType"
          :items="[
        {
          text: 'News',
          disabled: false,
          href: '/news'
        },
        {
          text: `${this.$route.query.searchType} search`,
          disabled: true,
          href: '/news'
        }
      ]"
          divider=">"
        ></v-breadcrumbs>
        <v-breadcrumbs
          v-else
          :items="[
        {
          text: 'News',
          disabled: true,
          href: '/news'
        }
      ]"
          divider=">"
        ></v-breadcrumbs>
        <h1 class="ml-2 headline text-capitalize" v-if="!!isFiltered">filtering by</h1>
        <ul v-if="!!isFiltered">
          <li v-if="this.$route.query.news">Searching news with "{{this.$route.query.news}}"</li>
        </ul>

        <v-btn color="primary" class="text-capitalize ma-2" small dark @click="toggleSearch">
          <v-icon class="pr-1" small>search</v-icon>search
        </v-btn>

        <!-- Apollo watched Graphql query -->
        <template
          v-if="!!this.advancedSearch.searchType && this.advancedSearch.searchType=='news'"
        >
          <ApolloQuery
            :query="require('./graphql/NewsSearch.gql')"
            :variables="{ 
              title: this.advancedSearch.newsSearch, 
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
                <news-table
                  v-if="data.newsArticles.newsList"
                  :items="data.newsArticles.newsList"
                  :totalResults="data.newsArticles.totalResults"
                  class="result apollo"
                  @updateOptions="updateOptions"
                ></news-table>
              </div>

              <!-- No result -->
              <div v-else class="no-result apollo">Loading...</div>
            </template>
          </ApolloQuery>
        </template>
        <template v-else>
          <ApolloQuery
            :query="require('./graphql/News.gql')"
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
                <!---<div>{{ JSON.stringify(data.newsArticles) }}</div>-->
                <news-table
                  v-if="data.newsArticles.newsList"
                  :items="data.newsArticles.newsList"
                  :totalResults="data.newsArticles.totalResults"
                  class="result apollo"
                  @updateOptions="updateOptions"
                ></news-table>
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
import NewsTable from "./components/NewsTable.vue";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      items: ["News"],
      company: "",
      page: 1,
      itemsPerPage: 10,
      sortBy: "",
      sortOrder: "",
      searchField: "",
      searchAdvance: {
        country: "",
        name: "",
        lessThanEmployees: 0,
        moreThanEmployees: 0,
        status: "",
        region: "",
        state: "",
        city: ""
      },
      typeButton: "",
      isFiltered: false
    };
  },
  components: { NewsTable },
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
      this.$store.commit('showSearchDialog');
    },
    checkIfIsFiltered() {
      let result = false;
      for (let key in this.$route.query) {
        console.log(key);
        if (!!this.$route.query[key] && key !== "searchType") {
          result = true;
          break;
        }
      }
      return result;
    }
  },
  computed: {
    advancedSearch (){
       return this.$store.state.advancedSearch;
    }
  },
  props: {
    showSearch: { type: Boolean, default: false }
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
