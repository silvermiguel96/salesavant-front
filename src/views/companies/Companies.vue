<template>
  <v-container fluid>
    <v-card>
      <div>
        <v-breadcrumbs
          v-if="!!this.$route.query && !!this.$route.query.searchType"
          :large="true"
          :items="[
           {	          
             text: 'Companies',	            
             disabled: true,	              
             href: '/companies'	              
            },	             
            {	             
              text: `${this.$route.query.searchType} search`,	           
              disabled: true,	       
              href: '/companies'	     
            }	
          ]"	
            divider=">" 
          >
          <template v-slot:item="props">
            <v-breadcrumbs-item
              :href="props.item.href"
              :class="[props.item.disabled && 'disabled']"
              @click.prevent="$router.push(props.item.href)">
              {{ props.item.text }}
            </v-breadcrumbs-item>
          </template> 
        </v-breadcrumbs>
        <v-breadcrumbs
          v-else
          :large="true"
          :items="[
            {	          
            text: 'Companies',	            
            disabled: true,	              
            href: '/companies'	              
            }
          ]"
          divider=">"
        > 
        </v-breadcrumbs>
        <template v-if="!!this.advancedSearch.searchType && this.advancedSearch.searchType=='companies'" >
          <v-container fluid class="mx-1">
            <v-row no-gutters>
              <v-col cols="12" md="8">
                <div class="mt-6">
                  <span class="ml-2">Filtering by: </span>
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
                  ><strong>{{obj.labelKey}}:&nbsp;</strong>{{obj.labelVal}}</v-chip>
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
          </v-container>
          <ApolloQuery
            :query="require('./graphql/CompaniesAdvancedSearch.gql')"
            :variables="{ 
              ...this.advancedSearch.companySearch,
              sortBy: this.sortBy,
              sortOrder: this.sortOrder,
              first: this.itemsPerPage,
              offset: (this.itemsPerPage * this.page) - this.itemsPerPage,
              totalResults: this.totalResults
            }"
            :update="data => {
              this.totalResults = data.companies.totalResults
              return data;
            }"
          >
            <template slot-scope="{ result: { loading, error, data } }">
              <!-- Loading -->
              <div v-if="loading" class="loading apollo">Loading...</div>

              <!-- Error -->
              <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

              <!-- Result -->
              <div v-else-if="data" class="result apollo">
                <!---<div>{{ JSON.stringify(data) }}</div>-->
                <companies-table
                  v-if="data.companies"
                  :items="data.companies.companiesList"
                  :totalResults="data.companies.totalResults"
                  class="result apollo"
                  @updateOptions="updateOptions"
                ></companies-table>
              </div>

              <!-- No result -->
              <div v-else class="no-result apollo">Loading...</div>
            </template>
          </ApolloQuery>
        </template>
        <template v-else>
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
          <ApolloQuery
            :query="require('./graphql/Companies.gql')"
            :variables="{
              searchNameOrDescription: this.search,
              first: this.itemsPerPage, 
              offset: (this.itemsPerPage * this.page) - this.itemsPerPage,
              sortBy: this.sortBy,
              sortOrder: this.sortOrder
            }"
            :skip="search.length >0 && search.length<=2"
          >
            <template slot-scope="{ result: { loading, error, data } }">
              <!-- Loading -->
              <div v-if="loading" class="loading apollo">Loading...</div>

              <!-- Error -->
              <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

              <!-- Result -->
              <div v-else-if="data" class="result apollo">
                <companies-table
                  v-if="data.companies.companiesList.length"
                  :items="data.companies.companiesList"
                  :totalResults="data.companies.totalResults"
                  class="result apollo"
                  @updateOptions="updateOptions"
                ></companies-table>
              </div>

              <!-- No result -->
              <div v-else class="no-result apollo">Loading...</div>
            </template>
          </ApolloQuery>
        </template>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
import _pickby from "lodash.pickby";
import CompaniesTable from "../../components/companies/CompaniesTable.vue";
import CreatePlaylistFromResults from "./components/CreatePlaylistFromResults.vue";
import CreateSignalFromResults from "./components/CreateSignalFromResults.vue";
import {defaultCompanySearch} from "../../store";

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
      isFiltered: false
    };
  },
  components: {
    CompaniesTable,
    CreatePlaylistFromResults,
    CreateSignalFromResults
  },
  watch:{
    companySearchFilters: function(val){
      console.log('total results to zero');
      this.totalResults = 0;
      this.page = 1;
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
                $lessThanEmployees: Int
                $moreThanEmployees: Int
                $playlistUid: String
                $signals: [Int]
                $signalGroups: [String],
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
                $signalGroups: [String],
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
              newSignalDefaultScore: newSignalDefaultScore,
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
    removeFilter(key){
      if (key.startsWith("signals")){
        let index = key.split(">>>")[1];
        let currentSignals = this.$store.state.advancedSearch.companySearch.signals.slice();
        let currentDisplaySignals = this.$store.state.advancedSearch.companySearch.displaySignals.slice();

        currentSignals.splice(index, 1);
        currentDisplaySignals.splice(index, 1);
        this.$store.commit('doCompanySearch', {
          ...this.$store.state.advancedSearch.companySearch,
          signals: currentSignals,
          displaySignals: currentDisplaySignals
        })
      }else if (key.startsWith("playlist")){
        this.$store.commit('doCompanySearch', {
          ...this.$store.state.advancedSearch.companySearch,
          playlistUid: "",
          displayPlaylistUid: "",
        })
      }else{
        this.$store.commit('doCompanySearch', {...this.$store.state.advancedSearch.companySearch, [key]: defaultCompanySearch[key]})
      }
    }
  },
  computed: {
    advancedSearch() {
      return this.$store.state.advancedSearch;
    },
    companySearchFilters(){
      let filterObjects = [];
      Object.keys(this.advancedSearch.companySearch).forEach(key => {
        let value = this.advancedSearch.companySearch[key];
        if (!key.startsWith('display') && value && value.length > 0){
          if (key=='signals'){
            value.forEach((entry, index) => {
              filterObjects.push({
                key: 'signals>>>'+index,
                labelKey: key,
                labelVal: this.advancedSearch.companySearch.displaySignals[index]
              });
            });
          }else if (key=='playlistUid'){
            filterObjects.push({
              key: key,
              labelKey: 'Playlist',
              labelVal: this.advancedSearch.companySearch.displayPlaylistUid
            });
          }else{
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
  },
  props: {
    showSearch: { type: Boolean, default: false }
  },
};
</script>
<style>
.calltoactions {
  display: flex;
  flex-direction: row;
}
.calltoactions .layout {
  flex: unset;
}
</style>