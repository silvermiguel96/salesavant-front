<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" xs="12" class="pt-0">
        <v-card>
          <v-row no-gutters>
            <v-col cols="12" xs="12" class="pt-0">
              <v-breadcrumbs
                class="pl-3 pl-sm-6"
                :large="true"
                :items="[
                {	          
                text: 'Admin Companies',	            
                disabled: true,	              
                href: '/companies'	              
                }
              ]"
                divider=">"
              ></v-breadcrumbs>
            </v-col>
          </v-row>
          <v-container fluid>
            <v-row no-gutters>
              <v-col cols="12" sm="3" md="3" lg="2" class="pa-1">
                <v-btn
                  class="text-capitalize d-inline-block"
                  min-width="150"
                  block
                  color="primary"
                  @click="triggerSearch"
                >
                  <v-icon class="pr-1">search</v-icon>Advanced Search
                </v-btn>
              </v-col>
              <v-row no-gutters class="d-flex justify-end">
                <v-col cols="12" sm="9" md="9" lg="9" class="pa-1">
                  <v-text-field
                    v-model="search"
                    append-icon="filter_list"
                    label="Quick Search"
                    placeholder="Type a Name"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-row>
          </v-container>

          <v-row class="pt-4" no-gutters>
            <v-col cols="12">
              <!-- Result -->
              <companies-admin-table
                v-if="companies"
                :items="companies.companiesList"
                :totalResults="companies.totalResults"
                @updateOptions="updateOptions"
              ></companies-admin-table>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12">
              <!-- Loading -->
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
import CompaniesAdminTable from "../../../components/admin/CompaniesAdminTable.vue";

export default {
  data() {
    return {
      totalResults: 0,
      search: "",
      isLoading: true,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: "",
      },
    };
  },
  components: {
    CompaniesAdminTable,
  },
  methods: {
    updateOptions({
      dataFromEvent: {
        page = 1,
        itemsPerPage = 10,
        sortBy = [],
        sortDesc = [],
      },
    }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
      if (sortBy.length > 0) {
        switch (sortBy[0]) {
          case "totalScore":
            this.options.sortBy = "score";
            break;
          case "numEmployees":
            this.options.sortBy = "employees";
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
    },
  },
  apollo: {
    companies: {
      query: gql`
        query companiesSearch(
          $playlistUid: String
          $signals: [Int]
          $signalGroups: [String]
          $searchName: String
          $searchDescription: String
          $searchWebsite: String
          $searchLinks: String
          $country: String
          $city: String
          $region: String
          $state: String
          $lessThanEmployees: Int
          $moreThanEmployees: Int
          $moreThanScore: Float
          $lessThanScore: Float
          $status: String
          $sortBy: String
          $sortOrder: String
          $first: Int
          $offset: Int
          $totalResults: Int
        ) {
          companies(
            playlistUid: $playlistUid
            signals: $signals
            signalGroups: $signalGroups
            searchName: $searchName
            searchDescription: $searchDescription
            searchWebsite: $searchWebsite
            searchLinks: $searchLinks
            country: $country
            city: $city
            region: $region
            state: $state
            lessThanEmployees: $lessThanEmployees
            moreThanEmployees: $moreThanEmployees
            moreThanScore: $moreThanScore
            lessThanScore: $lessThanScore
            status: $status
            sortBy: $sortBy
            sortOrder: $sortOrder
            first: $first
            offset: $offset
            totalResults: $totalResults
          ) {
            totalResults
            companiesList {
              creationTime
              modificationTime
              uid
              name
              description
              url
              handle
              logoUrl
              city
              country
              region
              state
              numEmployees
              momentum
              vertical
              industry
              status
              dateFounded
              linkedinHandle
              stockSymbol
              naicsCode
              totalScore
              totalSignals
            }
          }
        }
      `,
      variables() {
        if (this.showFiltersAndActions) {
          return {
            playlistUid: this.companySearch.playlistUid,
            signals: this.companySearch.signals,
            signalGroups: this.companySearch.signalGroups,
            searchName: this.companySearch.name,
            searchWebsite: this.companySearch.website,
            searchLinks: this.companySearch.links,
            searchDescription: this.companySearch.description,
            country: this.companySearch.country,
            city: this.companySearch.city,
            region: this.companySearch.region,
            state: this.companySearch.state,
            status: this.companySearch.status,
            lessThanEmployees: this.companySearch.lessThanEmployees,
            moreThanEmployees: this.companySearch.moreThanEmployees,
            moreThanScore: this.companySearch.moreThanScore,
            lessThanScore: this.companySearch.lessThanScore,
            first: this.options.itemsPerPage,
            offset:
              this.options.itemsPerPage * this.options.page -
              this.options.itemsPerPage,
            sortBy: this.options.sortBy,
            sortOrder: this.options.sortOrder,
            totalResults: this.totalResults,
          };
        } else {
          return {
            searchName: this.search,
            first: this.options.itemsPerPage,
            offset:
              this.options.itemsPerPage * this.options.page -
              this.options.itemsPerPage,
            sortBy: this.options.sortBy,
            sortOrder: this.options.sortOrder,
          };
        }
      },
      skip() {
        return this.search.length > 0 && this.search.length < 2;
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network",
    },
  },
  props: {
    showSearch: { type: Boolean, default: false },
  },
};
</script>