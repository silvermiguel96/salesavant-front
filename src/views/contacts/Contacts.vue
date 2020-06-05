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
                text: 'Contacts',	            
                disabled: true,	              
                href: '/contacts'	              
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
                  @click="resetContactSearch"
                  v-if="showFiltersAndActions"
                >
                  <v-icon class="pr-1" small>replay</v-icon>Reset
                </v-btn>
              </v-col>
              <v-row v-if="showFiltersAndActions" no-gutters class="d-flex justify-end">
                <v-col cols="12" sm="5" md="4" lg="3" class="pa-1">
                  <create-playlist-from-results @onSave="saveResultsAsPlaylist" />
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
          <v-row v-if="showFiltersAndActions" class="px-4" no-gutters>
            <v-col cols="12" md="8">
              <div class="mt-2">
                <span class="ml-2">Filtering by:</span>
                <v-chip
                  v-for="obj in contactSearchFilters"
                  :key="obj.key"
                  class="mx-1"
                  style="padding: 0 8px;"
                  color="green darken-3"
                  @click:close="removeFilter(obj.key)"
                  outlined
                  close
                  small
                >
                  <strong class="text-capitalize">{{obj.labelKey}}:&nbsp;</strong>
                  {{obj.labelVal}}
                </v-chip>
              </div>
            </v-col>
          </v-row>

          <v-row class="pt-4" no-gutters>
            <v-col cols="12">
              <!-- Result -->
              <contacts-table
                v-if="contacts"
                :items="contacts.contactsList"
                :totalResults="contacts.totalResults"
                @updateOptions="updateOptions"
              ></contacts-table>
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
import ContactsTable from "../../components/contacts/ContactsTable.vue";
import CreatePlaylistFromResults from "../../components/common/CreatePlaylistFromResults.vue";
import { mapMutations } from "vuex";
import { defaultContactSearch } from "../../store";

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
        sortOrder: ""
      }
    };
  },
  components: {
    ContactsTable,
    CreatePlaylistFromResults
  },
  methods: {
    ...mapMutations(["showSearchDialog", "resetContactSearch"]),
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
    },
    async saveResultsAsPlaylist(newPlaylistName = null) {
      console.log(
        "companies ",
        "saveResultsAsPlaylist ",
        "newPlaylistName =",
        newPlaylistName
      );
      if (!!this.searchType && !!newPlaylistName) {
        try {
          const result = await this.$apollo.mutate({
            mutation: gql`
              mutation(
                $name: String
                $title: String
                $department: String
                $rank: String
                $city: String
                $state: String
                $region: String
                $country: String
                $status: String
                $moreThanScaleScoreAverage: Int
                $lessThanScaleScoreAverage: Int
                $moreThanCesa: Int
                $lessThanCesa: Int
                $moreThanWolfpackScore: Int
                $lessThanWolfpackScore: Int
                $moreThanNumberOfExits: Int
                $lessThanNumberOfExits: Int
                $playlistUid: String
                $newPlaylistName: String!
              ) {
                createPlaylistFromContactSearch(
                  contactSearch: {
                    searchName: $name
                    searchTitle: $title
                    searchDepartment: $department
                    searchRank: $rank
                    city: $city
                    state: $state
                    region: $region
                    country: $country
                    status: $status
                    moreThanScaleScoreAverage: $moreThanScaleScoreAverage
                    lessThanScaleScoreAverage: $lessThanScaleScoreAverage
                    moreThanCesa: $moreThanCesa
                    lessThanCesa: $lessThanCesa
                    moreThanWolfpackScore: $moreThanWolfpackScore
                    lessThanWolfpackScore: $lessThanWolfpackScore
                    moreThanNumberOfExits: $moreThanNumberOfExits
                    lessThanNumberOfExits: $lessThanNumberOfExits
                    playlistUid: $playlistUid
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
              ...this.contactSearch,
              newPlaylistName: newPlaylistName
            }
          });
          console.log("saving results as playlist success", result);
          const playlist = _get(
            result,
            "data.createPlaylistFromContactSearch.playlist",
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
    removeFilter(key) {
      if (key.startsWith("playlist")) {
        this.$store.commit("doContactSearch", {
          ...this.$store.state.contactSearch,
          playlistUid: "",
          displayPlaylistUid: ""
        });
      } else {
        this.$store.commit("doContactSearch", {
          ...this.$store.state.contactSearch,
          [key]: defaultContactSearch[key]
        });
      }
    }
  },
  computed: {
    contactSearch() {
      return this.$store.state.contactSearch;
    },
    searchType() {
      return this.$store.state.searchType;
    },
    contactSearchFilters() {
      let filterObjects = [];
      Object.keys(this.contactSearch).forEach(key => {
        let value = this.contactSearch[key];
        if (!key.startsWith("display") && value && value.length > 0) {
          if (key == "playlistUid") {
            filterObjects.push({
              key: key,
              labelKey: "Playlist",
              labelVal: this.contactSearch.displayPlaylistUid
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
    },
    showFiltersAndActions() {
      return (
        !!this.searchType &&
        this.searchType == "contacts" &&
        !!this.contactSearchFilters &&
        this.contactSearchFilters.length
      );
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
              uid
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
        if (this.showFiltersAndActions) {
          return {
            searchName: this.contactSearch.name,
            searchTitle: this.contactSearch.title,
            searchDepartment: this.contactSearch.department,
            searchRank: this.contactSearch.rank,
            city: this.contactSearch.city,
            state: this.contactSearch.state,
            region: this.contactSearch.region,
            country: this.contactSearch.country,
            moreThanScaleScoreAverage: this.contactSearch
              .moreThanScaleScoreAverage,
            lessThanScaleScoreAverage: this.contactSearch
              .lessThanScaleScoreAverage,
            moreThanCesa: this.contactSearch.moreThanCesa,
            lessThanCesa: this.contactSearch.lessThanCesa,
            moreThanWolfpackScore: this.contactSearch.moreThanWolfpackScore,
            lessThanWolfpackScore: this.contactSearch.lessThanWolfpackScore,
            moreThanNumberOfExits: this.contactSearch.moreThanNumberOfExits,
            lessThanNumberOfExits: this.contactSearch.lessThanNumberOfExits,
            first: this.options.itemsPerPage,
            offset:
              this.options.itemsPerPage * this.options.page -
              this.options.itemsPerPage,
            sortBy: this.options.sortBy,
            sortOrder: this.options.sortOrder
          };
        } else {
          return {
            searchName: this.search,
            first: this.options.itemsPerPage,
            offset:
              this.options.itemsPerPage * this.options.page -
              this.options.itemsPerPage,
            sortBy: this.options.sortBy,
            sortOrder: this.options.sortOrder
          };
        }
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
