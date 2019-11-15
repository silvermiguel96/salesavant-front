<template>
  <v-container fluid>
    <v-card>
      <div class="apollo-example">
        <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
          {{ snackText }}
          <v-btn text @click="snack = false">Close</v-btn>
        </v-snackbar>
        <v-breadcrumbs
          v-if="!!this.$route.query && !!this.$route.query.searchType"
          :items="[
            {
              text: 'Signals',
              disabled: false,
              href: '/signals'
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
          :items="[
            {
              text: 'Signals',
              disabled: true,
              href: '/signals'
            }
          ]"
          divider=">"
        ></v-breadcrumbs>
        <h1 class="ml-2 headline text-capitalize" v-if="!!isFiltered">
          filtering by
        </h1>
        <ul class="ml-2" v-if="!!isFiltered">
          <li v-if="this.$route.query.search">
            Companies with the words "{{ this.$route.query.search }}" in the
            name or description
          </li>
          <li v-if="this.$route.query.group">
            Company group: {{ this.$route.query.group }}
          </li>
          <li v-if="this.$route.query.category">
            Company category: {{ this.$route.query.category }}
          </li>
        </ul>

        <v-btn
          small
          class="ma-2 text-capitalize"
          color="primary"
          dark
          @click="toggleSearch"
        >
          <v-icon small class="pr-1">search</v-icon>search
        </v-btn>
        <v-btn small class="ma-2 text-capitalize" to="/signals/create">
          <v-icon small class="pr-1">add</v-icon>new signal
        </v-btn>

        <template
          v-if="
            !!this.$route.query &&
              !!this.$route.query.searchType &&
              this.$route.query.searchType === 'signals'
          "
        >
          <ApolloQuery
            :query="require('./graphql/SearchsSignals.gql')"
            :variables="{
              search: this.$route.query.search,
              search: this.$route.query.search,
              search: this.$route.query.search,
              group: this.$route.query.group,
              category: this.$route.query.category,
              category: this.$route.query.category,
              category: this.$route.query.category,
              first: this.itemsPerPage,
              offset: this.itemsPerPage * this.page - this.itemsPerPage  
            }"
            :deep="true"
          >
            <template slot-scope="{ result: { loading, error, data } }">
              <!-- Loading -->
              <div v-if="loading" class="loading apollo">Loading...</div>

              <!-- Error -->
              <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

              <!-- Result -->
              <div v-else-if="data" class="result apollo">
                <!---<div>{{ JSON.stringify(data) }}</div>-->
                <signals-table
                  v-if="data.signals.signalsList"
                  @deleteSignal="deleteSignal"
                  :signalId="signalId"
                  :items="data.signals.signalsList"
                  :totalResults="data.signals.totalResults"
                  class="result apollo"
                  @updateOptions="updateOptions"
                ></signals-table>
              </div>

              <!-- No result -->
              <div v-else class="no-result apollo">Loading...</div>
            </template>
          </ApolloQuery>
        </template>
        <!-- Apollo watched Graphql query -->
        <template v-else>
          <ApolloQuery
            :query="require('./graphql/Signals.gql')"
            :variables="{
              first: this.itemsPerPage,
              offset: this.itemsPerPage * this.page - this.itemsPerPage   
            }"
            :deep="true"
          >
            <template slot-scope="{ result: { loading, error, data } }">
              <!-- Loading -->
              <div v-if="loading" class="loading apollo">Loading...</div>

              <!-- Error -->
              <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

              <!-- Result -->
              <div v-else-if="data" class="result apollo">
                <!---<div>{{ JSON.stringify(data) }}</div>-->
                <signals-table
                  v-if="data.signals.totalResults"
                  @deleteSignal="deleteSignal"
                  :signalId="signalId"
                  :items="data.signals.signalsList"
                  :totalResults="data.signals.totalResults"
                  class="result apollo"
                  @updateOptions="updateOptions"
                ></signals-table>
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
/* import PLAYLISTS from "./Playlists.gql"; */
import SignalsTable from "./components/SignalsTable.vue";
import gql from "graphql-tag";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      snack: false,
      snackColor: "",
      snackText: "",
      showTable: true,
      items: ["signals"],
      page: 1,
      itemsPerPage: 10,
      descending: false,
      sortBy: "",
      signalId: "",
      isFiltered: false
    };
  },
  components: { SignalsTable },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.page = page;
      this.itemsPerPage = itemsPerPage;
    },
    async deleteSignal(signalId) {
      // const signalId = this.signalId
      console.log("Delete Id", signalId);
      try {
        let result = null;
        result = await this.$apollo.mutate({
          mutation: gql`
            mutation($signalId: Int!) {
              deleteSignal(signalId: $signalId) {
                signal {
                  id
                }
              }
            }
          `,
          variables: {
            signalId: signalId
          }
        });
        console.log("Result", result);
        this.$router.go(this.$router.currentRoute);
        console.log(this.$apollo.queries);
        //this.$apollo.queries.AllSignals.skip = false;
        //this.$apollo.queries.AllSignals.refetch();
        return;
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "oops we did something wrong!";
        console.log("error delete signal", error);
      } finally {
        this.showTable = true;
      }
    },
    toggleSearch() {
      this.$emit("toggleSearch", {
        show: !this.$props.showSearch,
        expand: 3
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
