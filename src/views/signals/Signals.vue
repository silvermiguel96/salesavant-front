<template>
  <v-container fluid>
    <v-card>
      <div class="apollo-example">
        <v-breadcrumbs
        :large="true"
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
        :large="true"
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
            !!this.advancedSearch.searchType &&
              this.advancedSearch.searchType == 'signals'
          "
        >
          <ApolloQuery
            :query="require('./graphql/SearchsSignals.gql')"
            :variables="{
              ...this.advancedSearch.signalSearch,
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
import SignalsTable from "./components/SignalsTable.vue";
import gql from "graphql-tag";
import { setTimeout } from "timers";
import { mapMutations } from "../../store";

export default {
  data() {
    return {
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
      this.$store.commit('showSearchDialog')
    },
  },
  props: {
    showSearch: { type: Boolean, default: false }
  }
};
</script>
