<template>
  <v-container class="pa-0" fluid>
    <v-card>
      <v-container fluid>
        <v-row no-gutters class="d-flex justify-end">
          <v-col cols="10" sm="6">
            <v-text-field
              v-model="search"
              append-icon="filter_list"
              label="Quick Search"
              placeholder="Type a Full Name"
              hide-details
              autocomplete="off"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <div>
        <!-- Result -->
        <contacts-table
          v-if="companyContacts"
          :items="companyContacts.contactsList"
          :totalResults="companyContacts.totalResults"
          @updateOptions="updateOptions"
        ></contacts-table>
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
      </div>
    </v-card>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import ContactsTable from "../../contacts/ContactsTable.vue";

export default {
  components: {
    ContactsTable
  },
  data() {
    return {
      search: "",
      isLoading: true,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: ""
      }
    };
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
      if (sortBy.length > 0) {
        switch (sortBy[0]) {
          case "scaleScoreAverage":
            this.options.sortBy = "scale_score_average";
          case "capitalEfficiencyScoreAverage":
            this.options.sortBy = "capital_efficiency_score_average";
          case "wolfpackScore":
            this.options.sortBy = "wolfpack_score";
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
  },
  apollo: {
    companyContacts: {
      query: gql`
        query companyContacts(
          $companyUid: String
          $search: String
          $sortBy: String
          $sortOrder: String
          $first: Int
          $offset: Int
        ) {
          companyContacts(
            companyUid: $companyUid
            search: $search
            sortBy: $sortBy
            sortOrder: $sortOrder
            first: $first
            offset: $offset
          ) {
            totalResults
            contactsList {
              uid
              fullName
              linkedinHandle
              scaleScoreAverage
              capitalEfficiencyScoreAverage
              wolfpackScore
              numberOfExits
              companies {
                title
                isCurrent
                rank
                department
                company {
                  uid
                  name
                }
                title
                isCurrent
              }
            }
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid,
          search: this.search,
          sortBy: this.options.sortBy,
          sortOrder: this.options.sortOrder,
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage
        };
      },
      skip() {
        return this.search.length > 0 && this.search.length < 2;
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network"
    }
  },
  beforeCreate() {
    this.$apollo.queries.companyContacts;
  }
};
</script>
