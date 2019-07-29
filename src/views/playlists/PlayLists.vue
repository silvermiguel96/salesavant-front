<template>
  <!-- TODO agregar en la tabla totalScore, totalSignals -->
  <div class="apollo-example">
    <v-breadcrumbs
      :items="[
        {
          text: 'Playlists',
          disabled: true,
          href: '/playlists'
        }
      ]"
      divider=">"
    ></v-breadcrumbs>
    <h1
      class="ml-2"
      v-if="!!this.$route.query && !!this.$route.query.searchType"
    >You're currently filtering by</h1>
    <ul class="ml-2" v-if="!!this.$route.query && !!this.$route.query.searchType">
      <li v-if="this.$route.query.search">Searching playlist with "{{this.$route.query.search}}"</li>
    </ul>
    <v-btn color="primary" dark @click="toggleSearch">search</v-btn>
    <template
      v-if="!!this.$route.query && !!this.$route.query.searchType && this.$route.query.searchType === 'playlists' &&
      !!this.$route.query.search"
    >
      <ApolloQuery
        :query="require('./graphql/PlaylistSearch.gql')"
        :variables="{ search: this.$route.query.search, first: rowsPerPage, offset: (rowsPerPage * page) - rowsPerPage}"
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
              v-if="data.playlists.length"
              :items="data.playlists"
              class="result apollo"
              @updatePagination="updatePagination"
            ></play-lists-table>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">Loading...</div>
        </template>
      </ApolloQuery>
    </template>
  </div>
</template>
      </ApolloQuery>
    </template>
    <template v-else>
  <!-- Apollo watched Graphql query -->
  <ApolloQuery
    :query="require('./graphql/Playlists.gql')"
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
        <play-lists-table
          v-if="data.playlists.length"
          :items="data.playlists"
          class="result apollo"
          @updatePagination="updatePagination"
        ></play-lists-table>
      </div>

      <!-- No result -->
      <div v-else class="no-result apollo">Loading...</div>
    </template>
  </ApolloQuery>
</template>
  </div>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
import PlayListsTable from "./components/PlayListsTable.vue";
export default {
  data() {
    return {
      items: ["playlists"],
      descending: false,
      page: 1,
      rowsPerPage: 5,
      sortBy: "",
      totalItems: 5,
      isFiltered: false
    };
  },
  props: {
    showSearch: { type: Boolean, default: false }
  },
  components: { PlayListsTable },
  methods: {
    updatePagination({
      dataFromEvent: {
        descending = false,
        page = 1,
        rowsPerPage = 5,
        sortBy = "",
        totalItems = 5
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
        expand: "playlists"
      });
    }
  }
};
</script>
