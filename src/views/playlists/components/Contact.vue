<template>
  <v-container fluid>
    <v-card>
      <div class="apollo-example">
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
          :query="require('../graphql/Contacts.gql')"
          :variables="{
              search  : this.search,
              first: this.itemsPerPage, 
              offset: (this.itemsPerPage * this.page) - this.itemsPerPage
            }"
          :skip="search.length >0 && search.length<=2"
        >
          <template v-slot="{ result: { loading, error, data }, isLoading }">
            <!-- Result -->
            <Contacts-Table
              v-if="contatcs"
              :items="contatcs"
              :totalResults="contatcs.length"
              class="result apollo"
              @updateOptions="updateOptions"
            ></Contacts-Table>

            <!-- Loading -->
            <v-row justify="center" no-gutters>
              <v-col cols="12">
                <v-progress-linear
                  :active="!!isLoading"
                  color="blue"
                  indeterminate
                  absolute
                  bottom
                  query
                ></v-progress-linear>
              </v-col>
            </v-row>
          </template>
        </ApolloQuery>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import ContactsTable from "./ContactsTable.vue";

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
      newsSearch: "",
      typeButton: "",
      isFiltered: false,
      search: "",
      contatcs: [
        {
          uid: 1,
          fullname: "Miguelangel Rendon Cuartas",
          title: "developer",
          email: "silvermiguel96@gmail.com",
          find: "busqueda",
          deparment: "Company",
          linkedin:
            "https://www.linkedin.com/in/miguelangel-rendon-cuartas-73850416b/",
          jobs: [
            {
              id: 1,
              title: "Frontend Developer 1",
              company: "salesavant 1"
            }
          ]
        },
        {
          uid: 2,
          fullname: "Miguelangel Rendon Cuartas",
          title: "developer",
          email: "silvermiguel96@gmail.com",
          find: "busqueda",
          deparment: "Company",
          linkedin:
            "https://www.linkedin.com/in/miguelangel-rendon-cuartas-73850416b/",
          jobs: [
            {
              id: 1,
              title: "Frontend Developer 2",
              company: "salesavant 2"
            }
          ]
        },
        {
          uid: 3,
          fullname: "Miguelangel Rendon Cuartas",
          title: "developer",
          email: "silvermiguel96@gmail.com",
          find: "busqueda",
          deparment: "Company",
          linkedin:
            "https://www.linkedin.com/in/miguelangel-rendon-cuartas-73850416b/",
          jobs: [
            {
              id: 1,
              title: "Frontend Developer 3",
              company: "salesavant 3"
            }
          ]
        },
        {
          uid: 4,
          fullname: "Miguelangel Rendon Cuartas",
          title: "developer",
          email: "silvermiguel96@gmail.com",
          find: "busqueda",
          deparment: "Company",
          linkedin:
            "https://www.linkedin.com/in/miguelangel-rendon-cuartas-73850416b/",
          jobs: [
            {
              id: 1,
              title: "Frontend Developer 4",
              company: "salesavant 4"
            }
          ]
        },
        {
          uid: 5,
          fullname: "Miguelangel Rendon Cuartas",
          title: "developer",
          email: "silvermiguel96@gmail.com",
          find: "busqueda",
          deparment: "Company",
          linkedin:
            "https://www.linkedin.com/in/miguelangel-rendon-cuartas-73850416b/",
          jobs: [
            {
              id: 1,
              title: "Frontend Developer 5",
              company: "salesavant 5"
            }
          ]
        }
      ]
    };
  },
  components: {
    ContactsTable
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
          case "totalSignals":
            this.sortBy = "signals";
          case "numEmployees":
            this.sortBy = "employees";
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
    }
  }
};
</script>
