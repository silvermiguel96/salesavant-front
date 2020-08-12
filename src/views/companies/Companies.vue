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
                  text: 'Companies',	            
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
              <v-row v-if="showFiltersAndActions" no-gutters class="d-flex justify-end">
                <v-col cols="12" md="3" class="pt-1">
                  <create-playlist-from-results @onSave="saveResultsAsPlaylist" />
                </v-col>
                <v-col cols="12" md="3" class="pt-1 ml-2">
                  <create-signal-from-results @onSave="saveResultsAsSignal" />
                </v-col>
              </v-row>
              <v-row v-else no-gutters class="d-flex justify-end">
                <v-col cols="12" sm="8" md="8" lg="8" class="pa-1">
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
              <companies-table
                v-if="companies"
                :items="companies.companiesList"
                :totalResults="totalResults"
                @updateOptions="updateOptions"
              ></companies-table>
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
    <v-dialog v-model="waitDialog" persistent width="320">
      <v-card>
        <v-card-text class="pa-2 text-center">
          {{ waitDialogMessage }}
          <v-progress-linear indeterminate color="primary"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
import CompaniesTable from "../../components/companies/CompaniesTable.vue";
import CreatePlaylistFromResults from "../../components/common/CreatePlaylistFromResults.vue";
import CreateSignalFromResults from "../../components/common/CreateSignalFromResults.vue";
import { defaultCompanySearch } from "../../store";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      search: "",
      isLoading: true,
      waitDialog: false,
      waitDialogMessage: "",
      companies: [],
      totalResults: 0,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: "",
      },
    };
  },
  components: {
    CompaniesTable,
    CreatePlaylistFromResults,
    CreateSignalFromResults,
  },
  watch: {
    companySearchFilters: function (val) {
      console.log("total results to zero");
      this.totalResults = 0;
      this.options.page = 1;
    },
  },
  methods: {
    ...mapMutations(["showSearchDialog", "resetCompanySearch"]),
    triggerSearch() {
      this.showSearchDialog("companies");
    },
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
    async saveResultsAsPlaylist(newPlaylistName = null) {
      console.log(
        "companies ",
        "saveResultsAsPlaylist ",
        "newPlaylistName =",
        newPlaylistName
      );
      if (!!this.searchType && !!newPlaylistName) {
        this.waitDialogMessage = "Creating Playlist please wait...";
        this.waitDialog = true;
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $name: String
              $description: String
              $website: String
              $links: String
              $industry: String
              $naics: String
              $city: String
              $state: String
              $region: String
              $country: String
              $lessThanEmployees: Int
              $moreThanEmployees: Int
              $lessThanScore: Int
              $moreThanScore: Int
              $status: String
              $playlistUid: String
              $signals: [Int]
              $signalGroups: [String]
              $newPlaylistName: String!
            ) {
              createPlaylistFromCompanySearch(
                companySearch: {
                  searchName: $name
                  searchDescription: $description
                  searchWebsite: $website
                  searchLinks: $links
                  searchIndustry: $industry
                  searchNaics: $naics
                  city: $city
                  state: $state
                  region: $region
                  country: $country
                  lessThanEmployees: $lessThanEmployees
                  moreThanEmployees: $moreThanEmployees
                  lessThanScore: $lessThanScore
                  moreThanScore: $moreThanScore
                  status: $status
                  playlistUid: $playlistUid
                  signals: $signals
                  signalGroups: $signalGroups
                }
                playlistData: { name: $newPlaylistName }
              ) {
                playlist {
                  uid
                  name
                }
              }
            }
          `,
          variables: {
            ...this.companySearch,
            newPlaylistName: newPlaylistName,
          },
        });
        this.waitDialog = false;
        console.log("saving results as playlist success", result);
        const playlist = _get(
          result,
          "data.createPlaylistFromCompanySearch.playlist",
          null
        );
        this.$router.push({
          path: `/playlists/${playlist.uid}`,
        });
      }
    },
    async saveResultsAsSignal(signal = null) {
      if (!!this.searchType && !!signal) {
        const newSignalName = _get(signal, "name", "");
        const newSignalDescription = _get(signal, "description", "");
        const newSignalGroup = _get(signal, "group", "");
        const newSignalScore = parseFloat(_get(signal, "score", "0"));
        this.waitDialogMessage = "Creating Signal please wait...";
        this.waitDialog = true;
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $newSignalName: String
              $newSignalDescription: String
              $newSignalGroup: String
              $newSignalScore: Float
              $name: String
              $description: String
              $website: String
              $links: String
              $industry: String
              $naics: String
              $city: String
              $state: String
              $region: String
              $country: String
              $lessThanEmployees: Int
              $moreThanEmployees: Int
              $lessThanScore: Int
              $moreThanScore: Int
              $status: String
              $playlistUid: String
              $signals: [Int]
              $signalGroups: [String]
            ) {
              createSignalFromSearch(
                signalData: {
                  name: $newSignalName
                  description: $newSignalDescription
                  score: $newSignalScore
                  group: $newSignalGroup
                }
                companySearch: {
                  searchName: $name
                  searchDescription: $description
                  searchWebsite: $website
                  searchLinks: $links
                  searchIndustry: $industry
                  searchNaics: $naics
                  city: $city
                  state: $state
                  region: $region
                  country: $country
                  lessThanEmployees: $lessThanEmployees
                  moreThanEmployees: $moreThanEmployees
                  lessThanScore: $lessThanScore
                  moreThanScore: $moreThanScore
                  status: $status
                  playlistUid: $playlistUid
                  signals: $signals
                  signalGroups: $signalGroups
                }
              ) {
                status
                signal {
                  id
                  name
                }
              }
            }
          `,
          // Parameters
          variables: {
            ...this.companySearch,
            newSignalName: newSignalName,
            newSignalDescription: newSignalDescription,
            newSignalGroup: newSignalGroup,
            newSignalScore: newSignalScore,
          },
        });
        this.waitDialog = false;
        console.log("saving results as signal success", result);
        if (result.data.createSignalFromSearch.status == "ok") {
          if (!!result.data.createSignalFromSearch.signal) {
            this.$router.push({
              path: `/signals/${result.data.createSignalFromSearch.signal.id}`,
            });
          } else {
            this.$router.push({
              path: "/batch",
            });
          }
        } else {
          console.log("Error creating signal");
        }
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
    searchUrl() {
      if (
        !!this.search &&
        this.search.toLowerCase().startsWith("url:") &&
        this.search.trim().length > 4
      ) {
        return this.search.split(":")[1].trim();
      }
      return undefined;
    },
  },
  apollo: {
    companies: {
      query: gql`
        query companiesSearch(
          $url: String
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
          companies(
            url: $url
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
            companiesList {
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
              industry
              status
              dateFounded
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
            first: this.options.itemsPerPage,
            offset:
              this.options.itemsPerPage * this.options.page -
              this.options.itemsPerPage,
            sortBy: this.options.sortBy,
            sortOrder: this.options.sortOrder,
          };
        } else {
          return {
            url: this.searchUrl,
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
        return (
          !!this.search &&
          this.search.toLowerCase().startsWith("url:") &&
          this.search.length < 8
        );
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      // Optional result hook
      result({ data, loading, networkStatus }) {
        if (this.options.page == 1 && !!data && !!data.companies) {
          this.totalResults = data.companies.totalResults;
        }
      },
      fetchPolicy: "cache-and-network",
    },
  },
};
</script>