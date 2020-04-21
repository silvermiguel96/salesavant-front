<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" xs="12" class="px-0">
        <v-row no-gutters class="pl-2 pl-sm-6">
          <v-col cols="10" sm="4">
            <v-text-field
              v-model="search"
              append-icon="filter_list"
              label="Quick Search"
              placeholder="Type a Full Name"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <contacts-table
              v-if="playlistCompanyContacts"
              :items="playlistCompanyContacts.contactsList"
              :totalResults="playlistCompanyContacts.totalResults"
              @updateOptions="updateOptions"
            ></contacts-table>
          </v-col>
        </v-row>
        <v-row no-gutters>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import ContactsTable from "../../../contacts/ContactsTable.vue";

export default {
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
  components: {
    ContactsTable
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
            break;
          case "capitalEfficiencyScoreAverage":
            this.options.sortBy = "capital_efficiency_score_average";
            break;
          case "wolfpackScore":
            this.options.sortBy = "wolfpack_score";
            break;
          case "numberOfExits":
            this.options.sortBy = "number_of_exits";
            break;
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
    playlistCompanyContacts: {
      query: gql`
        query playlistCompanyContacts(
          $playlistUid: String
          $search: String
          $sortBy: String
          $sortOrder: String
          $first: Int
          $offset: Int
        ) {
          playlistCompanyContacts(
            playlistUid: $playlistUid
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
                rank
                department
                isCurrent
                company {
                  uid
                  name
                }
              }
            }
          }
        }
      `,
      variables() {
        return {
          playlistUid: this.$route.params.playlistUid,
          search: this.search,
          sortBy: this.options.sortBy,
          sortOrder: this.options.sortOrder,
          first: this.options.itemsPerPage,
          offset: this.options.itemsPerPage * this.options.page - this.options.itemsPerPage
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
  }
};
</script>
