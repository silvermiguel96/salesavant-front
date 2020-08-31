<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <v-row no-gutters class="pt-5">
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
          <v-col cols="12" sm="2" md="2" lg="1" class="pa-1">
            <v-btn
              class="text-capitalize d-inline-block"
              color="normal"
              block
              @click="resetCompanySearch"
              v-if="showFiltersAndActions"
            >
              <v-icon class="pr-1" small>replay</v-icon>Reset
            </v-btn>
          </v-col>
          <v-row v-if="!showFiltersAndActions" no-gutters class="d-flex justify-end">
            <v-col cols="12" sm="8" md="8" lg="8" class="pa-1">
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
        <v-row v-if="showFiltersAndActions" class="pa-1" no-gutters>
          <v-col cols="12" md="8">
            <div class="mt-2">
              <span class="ml-2">Filtering by:</span>
              <v-chip
                v-for="obj in companySearchFilters"
                :key="obj.key"
                @click:close="removeFilter(obj.key)"
                class="mx-1"
                style="padding: 0 8px;"
                color="light-blue darken-1"
                dark
                close
                small
              >
                <span class="text-capitalize font-weight-bold">{{obj.labelKey}}:&nbsp;</span>
                <span class="font-weight-medium">{{obj.labelVal}}</span>
              </v-chip>
            </div>
          </v-col>
        </v-row>
        <v-row class="pt-4" no-gutters>
          <v-col cols="12">
            <!-- Result -->
            <v-data-table
              :headers="headers"
              :items="companiesScores.companyAggsList"
              :server-items-length="companiesScores.totalResults"
              :items-per-page="options.itemsPerPage"
              :footer-props="{
                  'items-per-page-options': [10, 20, 50]
              }"
              :options.sync="options"
              class="mx-2"
              @update:options="updateOptions"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td>
                    <router-link :to="`/companies/${ item.companyUid}`">
                      <long-paragraph :text="item.companyName" :maxLength="35"></long-paragraph>
                    </router-link>
                  </td>
                  <td>{{ item.totalScore ? item.totalScore.toLocaleString() : "0"}}</td>
                  <td>{{ item.totalSignals ? item.totalSignals.toLocaleString() : "0"}}</td>
                </tr>
              </template>
            </v-data-table>
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
      </v-card-text>
    </v-card>
    <v-dialog v-model="reloadDialog" persistent width="320">
      <v-card>
        <v-card-title class="headline" dark>Polling timeout</v-card-title>
        <v-card-text>You need to reload this page!</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="reloadDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
import LongParagraph from "../../components/common/LongParagraph.vue";
import { defaultCompanySearch } from "../../store";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      headers: [
        { text: "Company", value: "name", width: "20%", sortable: false },
        {
          text: "Total Score",
          value: "totalScore",
          width: "10%",
          sortable: true,
        },
        {
          text: "Total Signals",
          value: "numEmployees",
          width: "10%",
          sortable: true,
        },
      ],
      reloadDialog: false,
      search: "",
      isLoading: false,
      companiesScores: {
        companyAggsList: [],
        totalResults: 0,
      },
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortOrder: [],
      },
    };
  },
  components: {
    LongParagraph,
  },
  mounted() {
    setTimeout(() => {
      console.log("Pooling timeout, Stop polling");
      this.$apollo.queries.companiesScores.stopPolling();
      this.reloadDialog = true;
    }, 10 * 60 * 1000);
  },
  methods: {
    ...mapMutations(["showSearchDialog", "resetCompanySearch"]),
    triggerSearch() {
      this.showSearchDialog("companies");
    },
    updateOptions({ page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }) {
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
    removeFilter(key) {
      if (key.startsWith("signals")) {
        let index = key.split(">>>")[1];
        let currentSignals = this.$store.state.companySearch.signals.slice();
        let currentDisplaySignals = this.$store.state.companySearch.displaySignals.slice();

        currentSignals.splice(index, 1);
        currentDisplaySignals.splice(index, 1);
        this.$store.commit("doCompanySearch", {
          ...this.$store.state.companySearch,
          signals: currentSignals,
          displaySignals: currentDisplaySignals,
        });
      } else if (key.startsWith("playlist")) {
        this.$store.commit("doCompanySearch", {
          ...this.$store.state.companySearch,
          playlistUid: "",
          displayPlaylistUid: "",
        });
      } else {
        this.$store.commit("doCompanySearch", {
          ...this.$store.state.companySearch,
          [key]: defaultCompanySearch[key],
        });
      }
    },
  },
  computed: {
    companySearch() {
      return this.$store.state.companySearch;
    },
    searchType() {
      return this.$store.state.searchType;
    },
    companySearchFilters() {
      let filterObjects = [];
      Object.keys(this.companySearch).forEach((key) => {
        let value = this.companySearch[key];
        if (!key.startsWith("display") && value && value.length > 0) {
          if (key == "signals") {
            value.forEach((entry, index) => {
              filterObjects.push({
                key: "signals>>>" + index,
                labelKey: key,
                labelVal: this.companySearch.displaySignals[index],
              });
            });
          } else if (key == "playlistUid") {
            filterObjects.push({
              key: key,
              labelKey: "Playlist",
              labelVal: this.companySearch.displayPlaylistUid,
            });
          } else {
            filterObjects.push({
              key: key,
              labelKey: key,
              labelVal: value,
            });
          }
        }
      });
      return filterObjects;
    },
    showFiltersAndActions() {
      return (
        !!this.searchType &&
        this.searchType == "companies" &&
        !!this.companySearchFilters &&
        this.companySearchFilters.length
      );
    },
  },
  apollo: {
    companiesScores: {
      query: gql`
        query companiesScores(
          $playlistUid: String
          $signals: [Int]
          $signalGroups: [String]
          $searchLinks: String
          $searchName: String
          $searchDescription: String
          $searchWebsite: String
          $searchIndustry: String
          $searchNaics: String
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
        ) {
          companiesScores(
            playlistUid: $playlistUid
            signals: $signals
            signalGroups: $signalGroups
            searchLinks: $searchLinks
            searchName: $searchName
            searchDescription: $searchDescription
            searchWebsite: $searchWebsite
            searchIndustry: $searchIndustry
            searchNaics: $searchNaics
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
          ) {
            totalResults
            companyAggsList {
              companyUid
              companyName
              totalScore
              totalSignals
            }
          }
        }
      `,
      variables() {
        if (this.showFiltersAndActions) {
          return {
            searchLinks: this.companySearch.links,
            searchName: this.companySearch.name,
            searchWebsite: this.companySearch.website,
            searchDescription: this.companySearch.description,
            searchIndustry: this.companySearch.industry,
            searchNaics: this.companySearch.naics,
            country: this.companySearch.country,
            city: this.companySearch.city,
            region: this.companySearch.region,
            state: this.companySearch.state,
            status: this.companySearch.status,
            lessThanEmployees: this.companySearch.lessThanEmployees,
            moreThanEmployees: this.companySearch.moreThanEmployees,
            moreThanScore: this.companySearch.moreThanScore,
            lessThanScore: this.companySearch.lessThanScore,
            playlistUid: this.companySearch.playlistUid,
            signals: this.companySearch.signals,
            signalGroups: this.companySearch.signalGroups,
            sortBy: this.options.sortBy,
            sortOrder: this.options.sortOrder,
            first: this.options.itemsPerPage,
            offset:
              this.options.itemsPerPage * this.options.page -
              this.options.itemsPerPage,
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
        return !!this.search && this.search.length < 2;
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      pollInterval: 2000,
      fetchPolicy: null,
    },
  },
};
</script>

<style>
</style>