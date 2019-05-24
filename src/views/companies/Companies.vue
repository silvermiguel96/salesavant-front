<template>
  <div class="apollo-example">
    <v-breadcrumbs
      :items="[
        {
          text: 'Companies',
          disabled: true,
          href: '/companies'
        }
      ]"
      divider=">"
    ></v-breadcrumbs>

    <!-- Filter -->
    <companies-advanced-filter></companies-advanced-filter>

    <!-- Apollo watched Graphql query -->
    <ApolloQuery :query="require('./graphql/Companies.gql')" :variables="null">
      <template slot-scope="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occured</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
          <!---<div>{{ JSON.stringify(data) }}</div>-->
          <companies-table
            v-if="data.companies.length"
            :items="data.companies"
            class="result apollo"
          ></companies-table>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
import CompaniesTable from "../../components/companies/CompaniesTable.vue";
import CompaniesAdvancedFilter from "../../components/companies/CompaniesAdvancedFilter.vue";
export default {
  data() {
    return {
      items: ["Companies"],
      filter: false,
      company: ""
    };
  },
  components: { CompaniesTable, CompaniesAdvancedFilter }
  /* apollo: {
    playlists: PLAYLISTS
  } */
  // ,
  // methods: {
  //   save () {
  //     console.log(this.$company);
  //   }
  // }
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
