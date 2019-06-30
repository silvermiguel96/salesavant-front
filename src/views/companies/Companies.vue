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
    <companies-advanced-filter
      @changeFieldSerch="changeFieldSerch"
      @changeFieldSerchAdvanceName="changeFieldSerchAdvanceName"
      @changeFieldSerchAdvanceCountry="changeFieldSerchAdvanceCountry"
      @changeFieldSerchAdvanceLessThanEmployees="changeFieldSerchAdvanceLessThanEmployees"
      @changeFieldSerchAdvanceMoreThanEmployees="changeFieldSerchAdvanceMoreThanEmployees"
      @changeFieldSerchAdvanceStatus="changeFieldSerchAdvanceStatus"
      @changeFieldSerchAdvanceRegion="changeFieldSerchAdvanceRegion"
      @changeFieldSerchAdvanceState="changeFieldSerchAdvanceState"
      @changeFieldSerchAdvanceCity="changeFieldSerchAdvanceCity"
      @typeBtn="typeBtn"
    ></companies-advanced-filter>

    <!-- Apollo watched Graphql query -->
    <template v-if="typeButton == 1 ">
      <ApolloQuery
        :query="require('./graphql/CompaniesSearch.gql')"
        :variables="{ search: searchField , first: rowsPerPage, offset: (rowsPerPage * page) - rowsPerPage }"
      >
        <template slot-scope="{ result: { loading, error, data } }">
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occured</div>

          <!-- Result -->
          <div v-else-if="data" class="result apollo">
            <!---<div>{{ JSON.stringify(data) }}</div>-->
            <companies-table
              v-if="data.companies"
              :items="data.companies"
              class="result apollo"
              @updatePagination="updatePagination"
            ></companies-table>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">No result :(</div>
        </template>
      </ApolloQuery>
    </template>
    <template v-else-if="typeButton == 2 ">
      <ApolloQuery
        :query="require('./graphql/CompaniesAdvanceSearch.gql')"
        :variables="{ 
          company: searchAdvance.name,
          country: searchAdvance.country,
          website: searchAdvance.website,
          city: searchAdvance.city,
          region: searchAdvance.region,
          state: searchAdvance.state,
          status: searchAdvance.status,
          lessThanEmployees: searchAdvance.lessThanEmployees,
          moreThanEmployees: searchAdvance.moreThanEmployees,
          first: rowsPerPage,
          offset: (rowsPerPage * page) - rowsPerPage
          }"
      >
        <template slot-scope="{ result: { loading, error, data } }">
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occured</div>

          <!-- Result -->
          <div v-else-if="data" class="result apollo">
            <!---<div>{{ JSON.stringify(data) }}</div>-->
            <companies-table
              v-if="data.companies"
              :items="data.companies"
              class="result apollo"
              @updatePagination="updatePagination"
            ></companies-table>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">No result :(</div>
        </template>
      </ApolloQuery>
    </template>
    <template v-else>
      <ApolloQuery
        :query="require('./graphql/Companies.gql')"
        :variables="{first: rowsPerPage, offset: (rowsPerPage * page) - rowsPerPage}"
      >
        <template slot-scope="{ result: { loading, error, data } }">
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occured</div>

          <!-- Result -->
          <div v-else-if="data" class="result apollo">
            <!---<div>{{ JSON.stringify(data) }}</div>-->
            <companies-table
              v-if="data.companies "
              :items="data.companies"
              class="result apollo"
              @updatePagination="updatePagination"
            ></companies-table>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">No result :(</div>
        </template>
      </ApolloQuery>
    </template>
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
      typeButton: ""
    };
  },
  components: { CompaniesTable, CompaniesAdvancedFilter },
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
    changeFieldSerch(newValue) {
      this.searchField = newValue;
    },
    changeFieldSerchAdvanceName(newValue) {
      this.searchAdvance.name = newValue;
    },
    changeFieldSerchAdvanceCountry(newValue) {
      this.searchAdvance.country = newValue;
    },
    changeFieldSerchAdvanceLessThanEmployees(newValue) {
      this.searchAdvance.lessThanEmployees = newValue;
    },
    changeFieldSerchAdvanceMoreThanEmployees(newValue) {
      this.searchAdvance.moreThanEmployees = newValue;
    },
    changeFieldSerchAdvanceStatus(newValue) {
      this.searchAdvance.status = newValue;
    },
    changeFieldSerchAdvanceRegion(newValue) {
      this.searchAdvance.region = newValue;
    },
    changeFieldSerchAdvanceState(newValue) {
      this.searchAdvance.state = newValue;
    },
    changeFieldSerchAdvanceCity(newValue) {
      this.searchAdvance.city = newValue;
    },
    typeBtn(newValue) {
      this.typeButton = newValue;
    }
  }
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
