<template>
  <div class="apollo-example">
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
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
          disabled: false,
          href: '/signals'
        }
      ]"
      divider=">"
    ></v-breadcrumbs>
    <h1 v-if="!!this.$route.query && !!this.$route.query.searchType">You're currently filtering by</h1>
    <ul v-if="!!this.$route.query && !!this.$route.query.searchType">
      <li
        v-if="this.$route.query.search"
      >Companies with the words {{this.$route.query.search}} in the name or description</li>
      <li v-if="this.$route.query.group">Company group: {{this.$route.query.group}}</li>
      <li v-if="this.$route.query.category">Company category: {{this.$route.query.category}}</li>
    </ul>

    <v-btn color="primary" dark @click="toggleSearch">search</v-btn>
    <v-btn color="success" dark to="/signals/create">Create new signal</v-btn>

    <template
      v-if="!!this.$route.query &&
      !!this.$route.query.searchType &&
      this.$route.query.searchType ==='signals'"
    >
      <ApolloQuery
        :query="require('./graphql/SearchsSignals.gql')"
        :variables="{ 
          search: this.$route.query.search,  
          group: this.$route.query.group,
          category: this.$route.query.category, 
          first: rowsPerPage, 
          offset: (rowsPerPage * page) - rowsPerPage}"
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
              v-if="data.signals"
              @deleteSignal="deleteSignal"
              :signalId="signalId"
              :items="data.signals"
              class="result apollo"
              @updatePagination="updatePagination"
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
        :variables="{first: rowsPerPage, offset: (rowsPerPage * page) - rowsPerPage}"
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
              v-if="data.signals"
              @deleteSignal="deleteSignal"
              :signalId="signalId"
              :items="data.signals"
              class="result apollo"
              @updatePagination="updatePagination"
            ></signals-table>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">Loading...</div>
        </template>
      </ApolloQuery>
    </template>
  </div>
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
      descending: false,
      page: 1,
      rowsPerPage: 5,
      sortBy: "",
      totalItems: 10,
      signalId: ""
    };
  },
  components: { SignalsTable },
  methods: {
    updatePagination({
      dataFromEvent: {
        descending = false,
        page = 1,
        rowsPerPage = 5,
        sortBy = "",
        totalItems = 10
      }
    }) {
      this.descending = descending;
      this.page = page;
      this.rowsPerPage = rowsPerPage;
      this.sortBy = sortBy;
      this.totalItems = 5;
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
        expand: "signals"
      });
    }
  },
  props: {
    showSearch: { type: Boolean, default: false }
  },
  beforeCreate() {
    console.log("beforeCreate", "this.$router", this.$router);
    console.log("beforeCreate", "this.$route", this.$route);
  },
  created() {
    console.log("created", "this.$router", this.$router);
    console.log("created", "this.$route", this.$route);
  },
  beforeUpdate() {
    console.log("beforeUpdate", "this.$router", this.$router);
    console.log("beforeUpdate", "this.$route", this.$route);
  },
  updated() {
    console.log("updated", "this.$router", this.$router);
    console.log("updated", "this.$route", this.$route);
  }
};
</script>
