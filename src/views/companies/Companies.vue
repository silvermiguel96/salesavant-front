<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" xs="12" class="pt-0">
        <v-card>
          <v-row no-gutters>
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
          </v-row>
          <v-row
            no-gutters
            v-if="!!this.advancedSearch.searchType && this.advancedSearch.searchType=='companies'"
          >
            <v-col cols="12" md="8">
              <div class="mt-6">
                <span class="ml-2">Filtering by:</span>
                <v-chip
                  v-for="obj in companySearchFilters"
                  :key="obj.key"
                  class="mx-1 text-capitalize"
                  style="padding: 0 8px;"
                  color="blue-grey"
                  @click:close="removeFilter(obj.key)"
                  outlined
                  close
                  small
                >
                  <strong>{{obj.labelKey}}:&nbsp;</strong>
                  {{obj.labelVal}}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="d-flex justify-md-end">
                <div class="mr-2 mt-sm-3">
                  <create-playlist-from-results @onSave="saveResultsAsPlaylist" />
                </div>
                <div class="mr-2 mt-sm-3">
                  <create-signal-from-results @onSave="saveResultsAsSignal" />
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row v-else no-gutters class="pl-2 pl-sm-6">
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

          <v-row no-gutters>
            <v-col cols="12">
              <!-- Result -->
              <companies-table
                v-if="companies"
                :items="companies.companiesList"
                :totalResults="companies.totalResults"
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
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
import _pickby from "lodash.pickby";
import CompaniesTable from "../../components/companies/CompaniesTable.vue";
import CreatePlaylistFromResults from "./components/CreatePlaylistFromResults.vue";
import CreateSignalFromResults from "./components/CreateSignalFromResults.vue";
import { defaultCompanySearch } from "../../store";

export default {
  data() {
    return {
      totalResults: 0,
      page: 1,
      itemsPerPage: 10,
      sortBy: "",
      sortOrder: "",
      search: "",
      searchField: "",
      isLoading: true,
      isFiltered: false,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: ""
      }
    };
  },
  components: {
    CompaniesTable,
    CreatePlaylistFromResults,
    CreateSignalFromResults
  },
  watch: {
    companySearchFilters: function(val) {
      console.log("total results to zero");
      this.totalResults = 0;
      this.page = 1;
    }
  },
  apollo: {
    companies: {
      query: gql`
        query CompaniesAdvancedSearch(
          $searchNameOrDescription: String
          $playlistUid: String
          $signals: [Int]
          $signalGroups: [String]
          $name: String
          $website: String
          $description: String
          $country: String
          $city: String
          $region: String
          $state: String
          $status: String
          $lessThanEmployees: Int
          $moreThanEmployees: Int
          $moreThanScore: Float
          $lessThanScore: Float
          $sortBy: String
          $sortOrder: String
          $first: Int
          $offset: Int
          $totalResults: Int
        ) {
          companies(
            searchNameOrDescription: $searchNameOrDescription
            playlistUid: $playlistUid
            signals: $signals
            signalGroups: $signalGroups
            searchName: $name
            searchWebsite: $website
            searchDescription: $description
            country: $country
            city: $city
            region: $region
            state: $state
            status: $status
            lessThanEmployees: $lessThanEmployees
            moreThanEmployees: $moreThanEmployees
            moreThanScore: $moreThanScore
            lessThanScore: $lessThanScore
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
              website
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
        return {
          searchNameOrDescription: this.search,
          playlistUid: this.advancedSearch.companySearch.playlistUid,
          signals: this.advancedSearch.companySearch.signals,
          signalGroups: this.advancedSearch.companySearch.signalGroups,
          name: this.advancedSearch.companySearch.name,
          website: this.advancedSearch.companySearch.website,
          description: this.advancedSearch.companySearch.description,
          country: this.advancedSearch.country,
          city: this.advancedSearch.companySearch.city,
          region: this.advancedSearch.companySearch.region,
          state: this.advancedSearch.companySearch.state,
          status: this.advancedSearch.companySearch.status,
          lessThanEmployees: this.advancedSearch.companySearch
            .lessThanEmployees,
          moreThanEmployees: this.advancedSearch.companySearch
            .moreThanEmployees,
          moreThanScore: this.advancedSearch.companySearch.moreThanScore,
          lessThanScore: this.advancedSearch.companySearch.lessThanScore,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage,
          totalResults: this.totalResults,
          first: this.itemsPerPage,
          offset: this.itemsPerPage * this.page - this.itemsPerPage
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
            break;
          case "numEmployees":
            this.sortBy = "employees";
            break;
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
    },
    async saveResultsAsPlaylist(newPlaylistName = null) {
      console.log(
        "companies ",
        "saveResultsAsPlaylist ",
        "newPlaylistName =",
        newPlaylistName
      );
      if (!!this.advancedSearch.searchType && !!newPlaylistName) {
        try {
          const result = await this.$apollo.mutate({
            mutation: gql`
              mutation(
                $name: String
                $city: String
                $description: String
                $state: String
                $region: String
                $country: String
                $status: String
                $website: String
                $lessThanEmployees: Int
                $moreThanEmployees: Int
                $lessThanScore: Int
                $moreThanScore: Int
                $playlistUid: String
                $signals: [Int]
                $signalGroups: [String]
                $newPlaylistName: String!
              ) {
                createPlaylistFromSearch(
                  companySearch: {
                    searchName: $name
                    city: $city
                    searchDescription: $description
                    searchWebsite: $website
                    state: $state
                    region: $region
                    country: $country
                    status: $status
                    lessThanEmployees: $lessThanEmployees
                    moreThanEmployees: $moreThanEmployees
                    lessThanScore: $lessThanScore
                    moreThanScore: $moreThanScore
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
              ...this.advancedSearch.companySearch,
              newPlaylistName: newPlaylistName
            }
          });
          console.log("saving results as playlist success", result);
          const playlist = _get(
            result,
            "data.createPlaylistFromSearch.playlist",
            null
          );
          this.$router.push({
            path: `/playlists/${playlist.uid}`
          });
        } catch (error) {
          console.log("error saving simple search as a play list", error);
        }
      }
    },
    async saveResultsAsSignal(signal = null) {
      console.log("signal", signal);
      if (!!this.advancedSearch.searchType && !!signal) {
        const newSignalName = _get(signal, "name", "");
        const newSignalDescription = _get(signal, "description", "");
        const newSignalGroup = _get(signal, "group", "");
        const newSignalDefaultScore = parseFloat(
          _get(signal, "defaultScore", "0")
        );
        console.log("signal after if", {
          newSignalName,
          newSignalDescription,
          newSignalGroup,
          newSignalDefaultScore
        });
        try {
          const result = await this.$apollo.mutate({
            mutation: gql`
              mutation(
                $newSignalName: String
                $newSignalDescription: String
                $newSignalGroup: String
                $newSignalDefaultScore: Float
                $name: String
                $description: String
                $city: String
                $state: String
                $region: String
                $country: String
                $status: String
                $website: String
                $lessThanEmployees: Int
                $moreThanEmployees: Int
                $lessThanScore: Int
                $moreThanScore: Int
                $playlistUid: String
                $signals: [Int]
                $signalGroups: [String]
              ) {
                createSignalFromSearch(
                  signalData: {
                    name: $newSignalName
                    description: $newSignalDescription
                    defaultScore: $newSignalDefaultScore
                    group: $newSignalGroup
                  }
                  companySearch: {
                    searchName: $name
                    searchDescription: $description
                    city: $city
                    state: $state
                    region: $region
                    country: $country
                    status: $status
                    lessThanEmployees: $lessThanEmployees
                    moreThanEmployees: $moreThanEmployees
                    lessThanScore: $lessThanScore
                    moreThanScore: $moreThanScore
                    searchWebsite: $website
                    playlistUid: $playlistUid
                    signals: $signals
                    signalGroups: $signalGroups
                  }
                ) {
                  signal {
                    id
                    name
                  }
                }
              }
            `,
            // Parameters
            variables: {
              ...this.advancedSearch.companySearch,
              newSignalName: newSignalName,
              newSignalDescription: newSignalDescription,
              newSignalGroup: newSignalGroup,
              newSignalDefaultScore: newSignalDefaultScore
            }
          });
          console.log("saving results as signal success", result);
          const signal = _get(
            result,
            "data.createSignalFromSearch.signal",
            null
          );
          console.log("finish");
          this.$router.push({
            path: `/signals/${signal.id}`
          });
        } catch (error) {
          console.log("error saving search results as signal", error);
        }
      }
    },
    removeFilter(key) {
      if (key.startsWith("signals")) {
        let index = key.split(">>>")[1];
        let currentSignals = this.$store.state.advancedSearch.companySearch.signals.slice();
        let currentDisplaySignals = this.$store.state.advancedSearch.companySearch.displaySignals.slice();

        currentSignals.splice(index, 1);
        currentDisplaySignals.splice(index, 1);
        this.$store.commit("doCompanySearch", {
          ...this.$store.state.advancedSearch.companySearch,
          signals: currentSignals,
          displaySignals: currentDisplaySignals
        });
      } else if (key.startsWith("playlist")) {
        this.$store.commit("doCompanySearch", {
          ...this.$store.state.advancedSearch.companySearch,
          playlistUid: "",
          displayPlaylistUid: ""
        });
      } else {
        this.$store.commit("doCompanySearch", {
          ...this.$store.state.advancedSearch.companySearch,
          [key]: defaultCompanySearch[key]
        });
      }
    }
  },
  computed: {
    advancedSearch() {
      return this.$store.state.advancedSearch;
    },
    companySearchFilters() {
      let filterObjects = [];
      Object.keys(this.advancedSearch.companySearch).forEach(key => {
        let value = this.advancedSearch.companySearch[key];
        if (!key.startsWith("display") && value && value.length > 0) {
          if (key == "signals") {
            value.forEach((entry, index) => {
              filterObjects.push({
                key: "signals>>>" + index,
                labelKey: key,
                labelVal: this.advancedSearch.companySearch.displaySignals[
                  index
                ]
              });
            });
          } else if (key == "playlistUid") {
            filterObjects.push({
              key: key,
              labelKey: "Playlist",
              labelVal: this.advancedSearch.companySearch.displayPlaylistUid
            });
          } else {
            filterObjects.push({
              key: key,
              labelKey: key,
              labelVal: value
            });
          }
        }
      });
      return filterObjects;
    }
  },
  props: {
    showSearch: { type: Boolean, default: false }
  }
};
</script>