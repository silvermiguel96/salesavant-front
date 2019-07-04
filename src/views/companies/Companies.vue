<template>
  <div class="apollo-example">
    <v-breadcrumbs
      v-if="!!this.$route.query && !!this.$route.query.searchType"
      :items="[
        {
          text: 'Companies',
          disabled: false,
          href: '/companies'
        },
        {
          text: `${this.$route.query.searchType} search`,
          disabled: true,
          href: '/companies'
        }
      ]"
      divider=">"
    ></v-breadcrumbs>
    <v-breadcrumbs
      v-else
      :items="[
        {
          text: 'Companies',
          disabled: false,
          href: '/companies'
        }
      ]"
      divider=">"
    ></v-breadcrumbs>
    <h1 v-if="!!this.$route.query && !!this.$route.query.searchType">You're currently filtering by</h1>
    <ul v-if="!!this.$route.query && !!this.$route.query.searchType">
      <li
        v-if="this.$route.query.simpleSearch"
      >Companies with the words {{this.$route.query.simpleSearch}} in the name or description</li>
      <li v-if="this.$route.query.name">Company name: {{this.$route.query.name}}</li>
      <li v-if="this.$route.query.country">Company country: {{this.$route.query.country}}</li>
      <li v-if="this.$route.query.website">Company website: {{this.$route.query.website}}</li>
      <li v-if="this.$route.query.city">Company city: {{this.$route.query.city}}</li>
      <li v-if="this.$route.query.region">Company region: {{this.$route.query.region}}</li>
      <li v-if="this.$route.query.state">Company state: {{this.$route.query.state}}</li>
      <li v-if="this.$route.query.status">Company status: {{this.$route.query.status}}</li>
      <li
        v-if="this.$route.query.lessThanEmployees"
      >Companies with less than {{this.$route.query.lessThanEmployees}} employees</li>
      <li
        v-if="this.$route.query.moreThanEmployees"
      >Companies with more than {{this.$route.query.moreThanEmployees}} employees</li>
    </ul>

    <v-btn color="primary" dark @click="toggleSearch">search</v-btn>

    <!-- Apollo watched Graphql query -->
    <template
      v-if="!!this.$route.query && !!this.$route.query.searchType && this.$route.query.searchType==='simple' && !!this.$route.query.simpleSearch"
    >
      <ApolloQuery
        :query="require('./graphql/CompaniesSimpleSearch.gql')"
        :variables="{ search: this.$route.query.simpleSearch, first: rowsPerPage, offset: (rowsPerPage * page) - rowsPerPage }"
      >
        <template slot-scope="{ result: { loading, error, data } }">
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>

          <!-- Error -->
          <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

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
          <div v-else class="no-result apollo">Loading...</div>
        </template>
      </ApolloQuery>
    </template>
    <template
      v-else-if="!!this.$route.query && !!this.$route.query.searchType && this.$route.query.searchType==='company'"
    >
      <ApolloQuery
        :query="require('./graphql/CompaniesAdvancedSearch.gql')"
        :variables="{ 
          name: this.$route.query.name || '',
          country: this.$route.query.country || '',
          website: this.$route.query.website || '',
          city: this.$route.query.city || '',
          region: this.$route.query.region || '',
          state: this.$route.query.state || '',
          status: this.$route.query.status || '',
          lessThanEmployees: this.$route.query.lessThanEmployees || '0',
          moreThanEmployees: this.$route.query.moreThanEmployees || '0',
          first: rowsPerPage,
          offset: (rowsPerPage * page) - rowsPerPage
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
            <companies-table
              v-if="data.companies"
              :items="data.companies"
              class="result apollo"
              @updatePagination="updatePagination"
            ></companies-table>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">Loading...</div>
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
          <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

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
          <div v-else class="no-result apollo">Loading...</div>
        </template>
      </ApolloQuery>
    </template>
  </div>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
import CompaniesTable from "../../components/companies/CompaniesTable.vue";
export default {
  data() {
    return {
      items: ["Companies"],

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
  components: { CompaniesTable },
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
    },
    toggleSearch() {
      this.$emit("toggleSearch", { show: !this.$props.showSearch });
    }
  },
  props: {
    showSearch: { type: Boolean, default: false }
  },
  beforeCreate() {
    console.log("beforeCreate", "this.$router", this.$router);
    console.log("beforeCreate", "this.$route", this.$route);
  },
  created() {
    console.log("created", "this.$router", this.$router);
    console.log("created", "this.$route", this.$route);
  },
  beforeUpdate() {
    console.log("beforeUpdate", "this.$router", this.$router);
    console.log("beforeUpdate", "this.$route", this.$route);
  },
  updated() {
    console.log("updated", "this.$router", this.$router);
    console.log("updated", "this.$route", this.$route);
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
