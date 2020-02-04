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
          <template v-slot="{ result: { loading, error, data }, isLoading }">

            <!-- Result -->
              <Contacts-Table
                 v-if="data"
                :items="data.contacts.contactsList"
                :totalResults="data.contacts.totalResults"
                class="result apollo"
                @updateOptions="updateOptions">
              </Contacts-Table>

            <!-- No result -->
            <div v-else >No data was returned</div>

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
