<template>
  <v-container  fluid>
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
              first: this.options.itemsPerPage, 
              offset: (this.options.itemsPerPage * this.options.page) - this.options.itemsPerPage
            }"
          :skip="search.length >0 && search.length<=2"
        >
          <template v-slot="{ result: { loading, error, data }, isLoading }">
            <!-- Result -->
            <Contacts-Table
              v-if="data"
              :items="data.contacts.contactsList"
              :totalResults="data.contacts.totalResults"
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
import ContactsTable from "../../components/contacts/ContactsTable.vue";
export default {
  data() {
    return {
      search: "",
      isLoading: true,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: "",
      

      }
    };
  },
  components: {
    ContactsTable
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
      console.log(sortBy);
      if (sortBy.length > 0) {
        switch (sortBy[0]) {
          case "scaleScoreAverage":
            this.options.sortBy = "scale_score_average";
          case "capitalEfficiencyScoreAverage":
            this.options.sortBy = "capital_efficiency_score_average";
          case "capitalEfficiencyEstimateAverage":
            this.options.sortBy = "capitalEfficiencyEstimate_average";
          case "numberOfExits":
            this.options.sortBy = "number_of_exits";
        }
      } else {
        this.options.sortBy = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.options.sortOrder = "desc";
        } else {
          this.options.sortOrder = "asc";
        }
      } else {
        this.options.sortOrder = "";
      }
    }
  }
};
</script>
