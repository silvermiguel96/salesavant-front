<template>
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
      totalItems: 5
    };
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
    }
  }
  /* apollo: {
    playlists: PLAYLISTS
  } */
};
</script>

<style scoped>
.form,
.input,
.apollo,
.message {
  padding: 12px;
}

label {
  display: block;
  margin-bottom: 6px;
}

.input {
  font-family: inherit;
  font-size: inherit;
  border: solid 2px #ccc;
  border-radius: 3px;
}

.error {
  color: red;
}

.images {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
  grid-gap: 10px;
}

.image-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  border-radius: 8px;
}

.image {
  max-width: 100%;
  max-height: 100%;
}

.image-input {
  margin: 20px;
}
</style>
