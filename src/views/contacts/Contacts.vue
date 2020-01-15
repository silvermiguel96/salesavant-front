<template>
  <v-container fluid>
    <v-card>
      <div class="apollo-example">
        <v-breadcrumbs
          v-if="!!this.$route.query && !!this.$route.query.searchType"
          :large="true"
          :items="[
            {
              text: 'Contants',
              disabled: false,
              href: '/Contants'
            },
            {
              text: `${this.$route.query.searchType} search`,
              disabled: true,
              href: '/Contants'
            }
          ]"
          divider=">"
        >
          <template v-slot:item="props">
            <v-breadcrumbs-item
              :href="props.item.href"
              :class="[props.item.disabled && 'disabled']"
              @click.prevent="$router.push(props.item.href)"
            >{{ props.item.text }}</v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
        <v-breadcrumbs
          v-else
          :large="true"
          :items="[
        {
          text: 'Contacts',
          disabled: true,
          href: '/Contacts'
        }
      ]"
          divider=">"
        ></v-breadcrumbs>
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
          :query="require('./graphql/Contacts.gql')"
          :variables="{
              search  : this.search,
              first: this.itemsPerPage, 
              offset: (this.itemsPerPage * this.page) - this.itemsPerPage
            }"
          :skip="search.length >0 && search.length<=2"
        >
          <template slot-scope="{ result: { loading, error, data } }">
            <!-- Loading -->
            <div v-if="loading" class="loading apollo">Loading...</div>

            <!-- Error -->
            <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

            <!-- Result -->
            <div v-else-if="data" class="result apollo">
              <Contacts-Table
                 v-if="data.contacts.totalResults.length"
                :items="data.contacts.contactsList"
                :totalResults="data.contacts.totalResults"
                class="result apollo"
                @updateOptions="updateOptions">
              </Contacts-Table>
            </div>

            <!-- No result -->
            <div v-else class="no-result apollo">Loading...</div>
          </template>
        </ApolloQuery>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import ContactsTable from "../../components/contacts/ContactsTable.vue"
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
      search: ""
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