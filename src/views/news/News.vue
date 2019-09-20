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
          <v-icon small>search</v-icon>search
        </v-btn>

        <!-- Apollo watched Graphql query -->
        <template
          v-if="!!this.$route.query && !!this.$route.query.searchType && this.$route.query.searchType==='news' && !!this.$route.query.news"
        >
          <ApolloQuery
            :query="require('./graphql/NewsSearch.gql')"
            :variables="{ title: this.$route.query.news, first: rowsPerPage, offset: (rowsPerPage * page) - rowsPerPage }"
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
                  v-if="data.news"
                  :items="data.news"
                  class="result apollo"
                  @updatePagination="updatePagination"
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
            :variables="{first: rowsPerPage, offset: (rowsPerPage * page) - rowsPerPage}"
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
                  v-if="data.news"
                  :items="data.news"
                  class="result apollo"
                  @updatePagination="updatePagination"
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
export default {
  data() {
    return {
      items: ["News"],
      company: "",
      descending: false,
      page: 1,
      rowsPerPage: 5,
      sortBy: "",
      totalItems: 10,
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
    updatePagination({
      dataFromEvent: {
        descending = false,
        page = 1,
        rowsPerPage = 5,
        sortBy = "",
        totalItems = 10
      }
    }) {
      this.descending = descending;
      this.page = page;
      this.rowsPerPage = rowsPerPage;
      this.sortBy = sortBy;
      this.totalItems = 5;
    },
    toggleSearch() {
      this.$emit("toggleSearch", {
        show: !this.$props.showSearch,
        expand: 1
      });
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
