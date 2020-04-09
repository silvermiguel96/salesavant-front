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
            <v-col cols="12" md="2">
              <div>
                <a
                  @click.prevent="triggerSearch"
                  class="text-capitalize body-2"
                  block
                  color="primary"
                >Advanced Search</a>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <!-- Result -->
        <contacts-table
          v-if="contacts"
          :items="contacts.contactsList"
          :totalResults="contacts.totalResults"
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
import ContactsTable from "../../components/contacts/ContactsTable.vue";
import { mapMutations } from "vuex";

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
    ...mapMutations(["showSearchDialog"]),
    triggerSearch() {
      this.showSearchDialog("contacts");
    },
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
  computed: {
    contactSearch() {
      return this.$store.state.contactSearch;
    },
    searchType() {
      return this.$store.state.searchType;
    }
  },
  apollo: {
    contacts: {
      query: gql`
        query contacts(
          $searchName: String
          $searchTitle: String
          $searchDepartment: String
          $searchRank: String
          $city: String
          $state: String
          $region: String
          $country: String
          $moreThanScaleScoreAverage: Int
          $lessThanScaleScoreAverage: Int
          $moreThanCesa: Int
          $lessThanCesa: Int
          $moreThanWolfpackScore: Int
          $lessThanWolfpackScore: Int
          $moreThanNumberOfExits: Int
          $lessThanNumberOfExits: Int
          $sortBy: String
          $sortOrder: String
          $first: Int
          $offset: Int
          $totalResults: Int
        ) {
          contacts(
            searchName: $searchName
            searchTitle: $searchTitle
            searchDepartment: $searchDepartment
            searchRank: $searchRank
            city: $city
            state: $state
            region: $region
            country: $country
            moreThanScaleScoreAverage: $moreThanScaleScoreAverage
            lessThanScaleScoreAverage: $lessThanScaleScoreAverage
            moreThanCesa: $moreThanCesa
            lessThanCesa: $lessThanCesa
            moreThanWolfpackScore: $moreThanWolfpackScore
            lessThanWolfpackScore: $lessThanWolfpackScore
            moreThanNumberOfExits: $moreThanNumberOfExits
            lessThanNumberOfExits: $lessThanNumberOfExits
            sortBy: $sortBy
            sortOrder: $sortOrder
            first: $first
            offset: $offset
            totalResults: $totalResults
          ) {
            totalResults
            contactsList {
              creationTime
              modificationTime
              fullName
              linkedinHandle
              city
              state
              region
              country
              scaleScoreAverage
              capitalEfficiencyScoreAverage
              wolfpackScore
              numberOfExits
              companies {
                company {
                  uid
                  name
                }
                title
                department
                rank
                isCurrent
              }
            }
          }
        }
      `,
      variables() {
        return {
          searchName: this.contactSearch.name,
          searchTitle: this.contactSearch.title,
          searchDepartment: this.contactSearch.department,
          searchRank: this.contactSearch.rank,
          city: this.contactSearch.city,
          state: this.contactSearch.state,
          region: this.contactSearch.region,
          country: this.contactSearch.country,
          moreThanScaleScoreAverage: this.contactSearch.moreThanScaleScoreAverage,
          lessThanScaleScoreAverage: this.contactSearch.lessThanScaleScoreAverage,
          moreThanCesa: this.contactSearch.moreThanCesa,
          lessThanCesa: this.contactSearch.lessThanCesa,
          moreThanWolfpackScore: this.contactSearch.moreThanWolfpackScore,
          lessThanWolfpackScore: this.contactSearch.lessThanWolfpackScore,
          moreThanNumberOfExits: this.contactSearch.moreThanNumberOfExits,
          lessThanNumberOfExits: this.contactSearch.lessThanNumberOfExits,
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
