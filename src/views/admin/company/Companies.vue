<template>
  <v-app>
    <v-navigation-drawer
      :width="190"
      v-model="drawers"
      overlay-opacity
      clipped
      :permanent="permanent"
      app
      color="primary"
    >
      <v-list dense>
        <v-list-item-group v-model="item" color="white">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.router">
            <v-list-item-icon>
              <v-icon class="white--text" v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                class="title-2 white--text font-weight-regular text-decoration"
                :to="item.router"
                v-text="item.title"
              />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-card>
      <v-toolbar dense class="elevation-0">
        <v-app-bar-nav-icon icon @click="permanent = !permanent"></v-app-bar-nav-icon>
        <v-toolbar-title>Data</v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <v-row>
          <v-col cols="12" xs="12" class="pt-0">
            <v-container fluid>
              <v-row no-gutters>
                <v-col cols="12" sm="3" md="3" lg="2" class="pa-1">
                  <v-btn
                    class="text-capitalize d-inline-block"
                    min-width="150"
                    block
                    color="primary"
                  >
                    <v-icon class="pr-1">search</v-icon>Advanced Search
                  </v-btn>
                </v-col>
                <v-row no-gutters class="d-flex justify-end">
                  <v-col cols="12" sm="6" md="6" lg="6" class="pa-1">
                    <v-text-field
                      v-model="search"
                      append-icon="filter_list"
                      label="Quick Search"
                      placeholder="Type a Name"
                      hide-details
                      autocomplete="off"
                      clearable
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
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-app>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
import CompaniesAdminTable from "../../../components/admin/CompaniesAdminTable.vue";

export default {
  data() {
    return {
      drawers: "",
      permanent: false,
      item: 2,
      items: [
        { title: "My Account", icon: "account_box", router: "/home" },
        { title: "Users", icon: "person", router: "/admin" },
        { title: "Data", icon: "layers", router: "/companies-admin" },
      ],
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
<style scoped>
.text-decoration {
  text-decoration: none;
}
</style>