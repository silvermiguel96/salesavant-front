<template>
  <v-container fluid>
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
          {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-card>
      <div class="apollo-example">
        <v-breadcrumbs
          v-if="!!this.$route.query && !!this.$route.query.searchType"
          :large="true"
          :items="[
        {
          text: 'Companies',
          disabled: false,
          href: '/companies'
        },
        {
          text: `${this.$route.query.searchType} search`,
          disabled: true,
          href: '/companies'
        }
      ]"
          divider=">"
        ></v-breadcrumbs>
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
        ></v-breadcrumbs>
        <span class="ml-6 body-1" v-if="!!isFiltered">Filtering by</span>
        <ul class="ml-6 body-2" v-if="!!isFiltered">
          <li v-if="this.$route.query.simpleSearch">Companies with the words {{this.$route.query.simpleSearch}} in the name or description</li>
          <li v-if="this.$route.query.name">Company name: {{this.$route.query.name}}</li>
          <li v-if="this.$route.query.description">Company description: {{this.$route.query.description}}</li>
          <li v-if="this.$route.query.country">Company country: {{this.$route.query.country}}</li>
          <li v-if="this.$route.query.website">Company url: {{this.$route.query.website}}</li>
          <li v-if="this.$route.query.city">Company city: {{this.$route.query.city}}</li>
          <li v-if="this.$route.query.region">Company region: {{this.$route.query.region}}</li>
          <li v-if="this.$route.query.state">Company state: {{this.$route.query.state}}</li>
          <li v-if="this.$route.query.status">Company status: {{this.$route.query.status}}</li>
          <li
            v-if="!!this.$route.query.lessThanEmployees && this.$route.query.lessThanEmployees != 0"
          >Less than {{this.$route.query.lessThanEmployees}} employees</li>
          <li
            v-if="!!this.$route.query.moreThanEmployees && this.$route.query.moreThanEmployees != 0"
          >More than {{this.$route.query.moreThanEmployees}} employees</li>
          <li
            v-if="!!this.$route.query.moreThanScore && this.$route.query.moreThanScore != 0"
          >Score more than {{this.$route.query.moreThanScore}}</li>
          <li
            v-if="!!this.$route.query.lessThanScore && this.$route.query.lessThanScore != 0"
          >Score less than {{this.$route.query.lessThanScore}}</li>
          <li v-if="this.$route.query.playlistUid">Playlist Id: {{this.$route.query.playlistUid}}</li>
          <li
            v-if="!!this.$route.query.signalId && this.$route.query.signalId != 0"
          >Signal Id: {{this.$route.query.signalId}}</li>
          <li
            v-if="this.$route.query.signalGroup"
          >Signal group name: {{this.$route.query.signalGroup}}</li>
        </ul>
          
        <!-- Apollo watched Graphql query -->
        <template
          v-if="!!this.$route.query && !!this.$route.query.searchType && this.$route.query.searchType==='company'"
        >
          <ApolloQuery
            :query="require('./graphql/CompaniesAdvancedSearch.gql')"
            :variables="{ 
              name: this.$route.query.name || '',
              description: this.$route.query.description || '',
              country: this.$route.query.country || '',
              website: this.$route.query.website || '',
              city: this.$route.query.city || '',
              region: this.$route.query.region || '',
              state: this.$route.query.state || '',
              status: this.$route.query.status || '',
              lessThanEmployees: this.$route.query.lessThanEmployees || '0',
              moreThanEmployees: this.$route.query.moreThanEmployees || '0',
              moreThanScore: Number.parseFloat(this.$route.query.moreThanScore || '-1'),
              lessThanScore: Number.parseFloat(this.$route.query.lessThanScore || '0') ,
              playlistUid: this.$route.query.playlistUid || '',
              signalId: this.$route.query.signalId || 0,
              signalGroup: this.$route.query.signalGroup || '',
              first: this.itemsPerPage,
              offset: (this.itemsPerPage * this.page) - this.itemsPerPage,
              sortBy: this.sortBy,
              sortOrder: this.sortOrder
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
            <v-col cols="12" md="8">
              <div class="d-flex justify-md-end">
                <div class="mt-2 mr-2">
                  <create-playlist-from-results v-if="isFiltered" @onSave="saveResultsAsPlaylist" />
                </div>
                <div class="mt-2 mr-2">
                  <create-signal-from-results v-if="isFiltered" @onSave="saveResultsAsSignal" />
                </div>
              </div>
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
import CompaniesTable from "../../components/companies/CompaniesTable.vue";
import CreatePlaylistFromResults from "./components/CreatePlaylistFromResults.vue";
import CreateSignalFromResults from "./components/CreateSignalFromResults.vue";
export default {
  data() {
    return {
      items: ["Companies"],
      company: "",
      page: 1,
      itemsPerPage: 10,
      sortBy: "",
      sortOrder: "",
      search:"",
      searchField: "",
      searchAdvance: {
        country: "",
        name: "",
        description: "",
        lessThanEmployees: 0,
        moreThanEmployees: 0,
        moreThanScore: 0,
        lessThanScore: 0,
        status: "",
        region: "",
        state: "",
        city: ""
      },
      isFiltered: false,
      snack: false,
      snackColor: "",
      snackText: ""
    };
  },
  components: {
    CompaniesTable,
    CreatePlaylistFromResults,
    CreateSignalFromResults
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
      }else{
        this.sortBy = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.sortOrder = "desc";
        } else {
          this.sortOrder = "asc";
        }
      }else{
        this.sortOrder = "";
      }
    },
    toggleSearch() {
      this.$emit("toggleSearch", {
        show: !this.$props.showSearch,
        expand: 0
      });
    },
    checkIfIsFiltered() {
      let result = false;
      for (let key in this.$route.query) {
        console.log("key", key);
        if (!!this.$route.query[key] && key !== "searchType") {
          result = true;
          break;
        }
      }
      return result;
    },
    async saveResultsAsPlaylist(newPlaylistName = null) {
      console.log(
        "companies ",
        "saveResultsAsPlaylist ",
        "newPlaylistName =",
        newPlaylistName
      );
      if (!this.checkIfIsFiltered()) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText =
          "At least one company field search criteria is not empty!";
        return;
      }
      if (!newPlaylistName) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "New Playlist Name can not be empty!";
        return;
      }
      if (this.checkIfIsFiltered() && !!newPlaylistName) {
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
                $playlistName: String!
                $playlistUid: String
                $signalId: Int
                $signalGroup: String
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
                    playlistUid: $playlistUid
                    signalId: $signalId
                    signalGroup: $signalGroup
                  }
                  playlistData: { name: $playlistName }
                ) {
                  playlist {
                    uid
                    name
                  }
                }
              }
            `,
            // Parameters
            variables: {
              name: _get(this.$route.query, "name", ""),
              description: _get(this.$route.query, "description", ""),
              country: _get(this.$route.query, "country", ""),
              website: _get(this.$route.query, "website", ""),
              city: _get(this.$route.query, "city", ""),
              region: _get(this.$route.query, "region", ""),
              state: _get(this.$route.query, "state", ""),
              status: _get(this.$route.query, "status", ""),
              lessThanEmployees: _get(
                this.$route.query,
                "lessThanEmployees",
                "0"
              ),
              moreThanEmployees: _get(
                this.$route.query,
                "moreThanEmployees",
                "0"
              ),
              playlistName: newPlaylistName,
              playlistUid: _get(this.$route.query, "playlistUid", ""),
              signalId: _get(this.$route.query, "signalId", 0),
              signalGroup: _get(this.$route.query, "signalGroup", "")
            }
          });
          console.log("saving results as playlist success", result);
          const playlist = _get(
            result,
            "data.createPlaylistFromSearch.playlist",
            null
          );
          if (!playlist) {
            this.snack = true;
            this.snackColor = "error";
            this.snackText =
              "it seems that we created your playlist but couldn't check it, please check manually";
            return;
          }
          this.$router.push({
            path: `/playlists/${playlist.uid}/companies`
          });
        } catch (error) {
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "oops we did something wrong!";
          console.log("error saving simple search as a play list", error);
        }
      }
    },
    async saveResultsAsSignal(signal = null) {
      if (!this.checkIfIsFiltered()) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText =
          "At least one company field search criteria is not empty!";
        return;
      }
      if (!signal) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Please fill the signal form!";
        return;
      }
      console.log("signal", signal);
      if (this.checkIfIsFiltered() && !!signal) {
        const signalName = _get(signal, "name", "");
        const signalDescription = _get(signal, "description", "");
        const signalGroup = _get(signal, "group", "");
        const signalDefaultScore = parseFloat(
          _get(signal, "defaultScore", "0")
        );
        console.log("signal after if", {
          signalName,
          signalDescription,
          signalGroup,
          signalDefaultScore
        });
        try {
          const result = await this.$apollo.mutate({
            mutation: gql`
              mutation(
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
                $signalName: String
                $signalDescription: String
                $signalGroup: String
                $signalDefaultScore: Float
                $playlistUid: String
                $signalIdFilter: Int
                $signalGroupFilter: String
              ) {
                createSignalFromSearch(
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
                    searchWebsite: $website
                    playlistUid: $playlistUid
                    signalId: $signalIdFilter
                    signalGroup: $signalGroupFilter
                  }
                  signalData: {
                    name: $signalName
                    description: $signalDescription
                    defaultScore: $signalDefaultScore
                    group: $signalGroup
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
              name: _get(this.$route.query, "name", ""),
              description: _get(this.$route.query, "description", ""),
              country: _get(this.$route.query, "country", ""),
              website: _get(this.$route.query, "website", ""),
              city: _get(this.$route.query, "city", ""),
              region: _get(this.$route.query, "region", ""),
              state: _get(this.$route.query, "state", ""),
              status: _get(this.$route.query, "status", ""),
              lessThanEmployees: _get(
                this.$route.query,
                "lessThanEmployees",
                "0"
              ),
              moreThanEmployees: _get(
                this.$route.query,
                "moreThanEmployees",
                "0"
              ),
              signalName: signalName,
              signalDescription: signalDescription,
              signalGroup: signalGroup,
              signalDefaultScore: signalDefaultScore,
              playlistUid: _get(this.$route.query, "playlistUid", ""),
              signalIdFilter: parseInt(_get(this.$route.query, "signalId", 0)),
              signalGroupFilter: _get(this.$route.query, "signalGroup", "")
            }
          });
          console.log("saving results as signal success", result);
          const signal = _get(
            result,
            "data.createSignalFromSearch.signal",
            null
          );
          if (!signal) {
            this.snack = true;
            this.snackColor = "error";
            this.snackText =
              "it seems that we created your signal but couldn't check it, please check manually";
            return;
          }
          console.log("finish");
          this.$router.push({
            path: `/signals/${signal.id}`
          });
        } catch (error) {
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "oops we did something wrong!";
          console.log("error saving search results as signal", error);
        }
      }
    }
  },
  props: {
    showSearch: { type: Boolean, default: false }
  },
  beforeMount() {
    this.isFiltered = this.checkIfIsFiltered();
  },
  beforeUpdate() {
    this.isFiltered = this.checkIfIsFiltered();
  },
  updated() {
    this.isFiltered = this.checkIfIsFiltered();
  }
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