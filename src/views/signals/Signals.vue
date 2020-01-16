<template>
  <v-container fluid>
    <v-card>
      <v-breadcrumbs
        :large="true"
        :items="[
          {
            text: 'Signals',
            disabled: true,
            href: '/signals'
          }
        ]"
        divider=">"
      ></v-breadcrumbs>
      <v-container fluid class="mx-1" v-if="!!isFiltered">
        <v-row no-gutters>
          <v-col cols="12" md="8">
            <div class="mt-6">
              <span class="ml-2">Filtering by:</span>
            </div>
            <v-chip
              v-if="this.$route.query.group"
              class="mx-1 text-capitalize"
              style="padding: 0 8px;"
              color="blue-grey"
              @click:close="removeFilter()"
              outlined
              close
              small
            >
              <strong>Company group:</strong>
              {{ this.$route.query.group }}
            </v-chip>
          </v-col>
        </v-row>
      </v-container>
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
              <div class="mt-3 mr-2">
                <v-btn class="text-capitalize" color="primary" min-width="150" to="/signals/create">
                  <v-icon size="18" class="mr-2">add</v-icon>new signal
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
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
                v-if="data.signals.totalResults"
                @deleteSignal="deleteSignal"
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
      <ApolloQuery
        v-else
        :query="require('./graphql/Signals.gql')"
        :variables="{
          search: this.search,
          first: this.itemsPerPage,
          offset: this.itemsPerPage * this.page - this.itemsPerPage
        }"
        :skip="search.length > 0 && search.length < 2"
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
      items: ["signals"],
      page: 1,
      itemsPerPage: 10,
      sortBy: "",
      signalId: "",
      sortOrder: "",
      search: ""
    };
  },
  components: {
    SignalsTable
  },
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
        return;
      } catch (error) {
        console.log("error delete signal", error);
      } finally {
        this.showTable = true;
      }
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
    removeFilter() {
      this.$router.push({ path: "/signals", query: {} });
    }
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
