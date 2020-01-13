<template>
  <v-container fluid>
    <v-card class="apollo-example">
      <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
        {{ snackText }}
        <v-btn text @click="snack = false">Close</v-btn>
      </v-snackbar>
      <v-breadcrumbs
      :large="true"
        v-if="!!this.$route.params.signalId"
        :items="[
          {
            text: 'Signals',
            disabled: false,
            href: '/signals'
          },
          {
            text: this.signal.name || this.$route.params.signalId,
            disabled: true,
            href: `/signals/${this.$route.params.signalId}`
          }
        ]"
        divider=">"
      ></v-breadcrumbs>
      <v-form @submit.prevent>
        <v-container fluid >
          <v-card-subtitle>
            <h1 class="headline my-4 text-capitalize">Signal details</h1>
          </v-card-subtitle>
          <v-layout wrap>
            <v-flex xs12 sm6 md6 class="px-1">
              <v-text-field
                v-model="signal.name"
                label="Name"
                required
                :disabled="!canModifySignalName"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6 class="px-1">
              <v-text-field
                v-model="signal.description"
                label="Description"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6 class="px-1">
              <v-text-field
                v-model="signal.defaultScore"
                label="Score"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md6 class="px-1">
              <v-text-field
                v-model="signal.group"
                label="Group"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 md2 lg2>
              <v-btn
                v-if="canModifySignalName"
                type="submit"
                @click="save"
                class="text-capitalize"
                color="primary"
                block
              >
                <v-icon small class="pr-1">{{
                  !!signal.id ? "update" : "add"
                }}</v-icon>
                {{ !!signal.id ? "Update" : "Create" }}
              </v-btn>
              <v-btn
                v-else
                type="submit"
                color="primary"
                @click="saveKeyWordsAsSignal"
                >Save from playlist keywords</v-btn
              >
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      <v-container fluid v-if="canModifySignalName">
        <v-card-subtitle>
          <h1 class="headline my-4 text-capitalize">Related companies</h1>
        </v-card-subtitle>
        <template
          v-if="
            !!this.$route.params.signalId &&
              this.$route.params.signalId !== 'create'
          "
        >
          <ApolloQuery
            :query="require('../graphql/SearchsCompanySignal.gql')"
            :variables="{
              signalId: parseInt(this.$route.params.signalId),
              first: this.itemsPerPage, 
              offset: (this.itemsPerPage * this.page) - this.itemsPerPage,
              sortBy: this.sortBy,
              sortOrder: this.sortOrder,
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
                <company-signals
                  v-if="data.signalCompanies.totalResults"
                  :items="data.signalCompanies.companiesList"
                  :totalResults="data.signalCompanies.totalResults"
                  class="result apollo"
                  @updateOptions="updateOptions"
                ></company-signals>
              </div>

              <!-- No result -->
              <div v-else class="no-result apollo">Loading...</div>
            </template>
          </ApolloQuery>
        </template>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
import companySignals from "./SignalCompanyTable.vue";

const defaultSignal = {
  id: "",
  name: "",
  group: "",
  userId: "",
  category: "",
  accountId: "",
  description: "",
  creationTime: "",
  defaultScore: "",
  modificationTime: ""
};

export default {
  data() {
    return {
      snack: false,
      snackColor: "",
      snackText: "",
      descending: false,
      sortBy: "",
      sortOrder: "",
      page: 1,
      itemsPerPage: 10,
      signal: { ...defaultSignal },
      companySignals: []
    };
  },
  components: {
    companySignals
  },
  props: {
    score: { type: Number, default: 0 },
    name: { type: String, default: "" },
    jobUid: { type: String, default: "" },
    canModifySignalName: { type: Boolean, default: true }
  },
  apollo: {
    // Query with parameters
    signal: {
      // gql query
      query: gql`
        query getSignalsById($signalId: Int) {
          signal(id: $signalId) {
            id
            name
            description
            group
            defaultScore
          }
        }
      `,
      variables() {
        return {
          signalId: this.$route.params.signalId
        };
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
    async save() {
      if (!this.signal) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "There's something wrong with the signal saving!";
        return;
      }
      if (!this.signal.name) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Name can not be empty!";
        return;
      }
      if (!this.signal.description) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Description can not be empty!";
        return;
      }
      if (!this.signal.defaultScore) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Score can not be empty!";
        return;
      }
      if (!this.signal.group) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Group can not be empty!";
        return;
      }
      try {
        console.log("here");
        let result = null;
        if (!!this.signal.id) {
          // update signal
          result = await this.$apollo.mutate({
            mutation: gql`
              mutation(
                $signalId: Int!
                $name: String
                $description: String
                $group: String
                $category: String
                $score: Float
              ) {
                updateSignal(
                  signalData: {
                    name: $name
                    description: $description
                    group: $group
                    category: $category
                    defaultScore: $score
                  }
                  signalId: $signalId
                ) {
                  signal {
                    id
                    name
                    group
                    userId
                    category
                    accountId
                    description
                    creationTime
                    defaultScore
                    modificationTime
                  }
                }
              }
            `,
            // Parameters
            variables: {
              signalId: this.signal.id,
              name: this.signal.name,
              description: this.signal.description,
              group: this.signal.group,
              category: this.signal.category,
              score: this.signal.defaultScore
            }
          });
          this.snack = true;
          this.snackColor = "success";
          this.snackText = "The signals are updated successfully!";
          console.log("Update signal success", result);
        } else {
          //create signal
          result = await this.$apollo.mutate({
            mutation: gql`
              mutation(
                $name: String
                $description: String
                $group: String
                $category: String
                $score: Float
              ) {
                createSignal(
                  signalData: {
                    name: $name
                    description: $description
                    group: $group
                    category: $category
                    defaultScore: $score
                  }
                ) {
                  signal {
                    id
                    name
                    group
                    userId
                    category
                    accountId
                    description
                    creationTime
                    defaultScore
                    modificationTime
                  }
                }
              }
            `,
            // Parameters
            variables: {
              name: this.signal.name,
              description: this.signal.description,
              group: this.signal.group,
              category: this.signal.category,
              score: this.signal.defaultScore
            }
          });
          this.snack = true;
          this.snackColor = "success";
          this.snackText = "The signals are saving successfully!";
          console.log("saving signal success", result);
        }
        const signal =
          _get(result, "data.createSignal.signal", null) ||
          _get(result, "data.updateSignal.signal", null);
        if (!signal) {
          this.snack = true;
          this.snackColor = "error";
          this.snackText =
            "it seems that we created/updated the signal but couldn't check it, please check manually";
          return;
        }
        this.signal = signal;
        this.$router.push({
          path: `/signals/${signal.id}`
        });
        this.$apollo.queries.signal;
        this.$apollo.queries.companySignals;
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "oops we did something wrong!";
        console.log("error saving signal", error);
      }
    },
    async saveKeyWordsAsSignal() {
      if (!this.signal) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "There's something wrong with the signal saving!";
        return;
      }
      if (!this.signal.name) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Name can not be empty!";
        return;
      }
      if (!this.signal.description) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Description can not be empty!";
        return;
      }
      if (!this.signal.defaultScore) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Score can not be empty!";
        return;
      }
      if (!this.signal.group) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Group can not be empty!";
        return;
      }
      if (!this.$props.jobUid) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "JobUid can not be empty!";
        return;
      }
      try {
        console.log("here");
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation($jobUid: String!, $keyword: String!, $defaultScore: Int) {
              createSignalFromPlaylistKeyword(
                jobUid: $jobUid
                keyword: $keyword
                defaultScore: $defaultScore
              ) {
                signal {
                  id
                  name
                  group
                  userId
                  category
                  accountId
                  description
                  creationTime
                  defaultScore
                  modificationTime
                }
              }
            }
          `,
          // Parameters
          variables: {
            keyword: this.signal.name,
            jobUid: this.$props.jobUid,
            defaultScore: this.signal.defaultScore
          }
        });
        this.snack = true;
        this.snackColor = "success";
        this.snackText = "The signals are saving successfully!";
        console.log("saving signal success", result);

        const signal = _get(
          result,
          "data.createSignalFromPlaylistKeyword.signal",
          null
        );

        console.log("signal", signal);
        if (!signal) {
          this.snack = true;
          this.snackColor = "error";
          this.snackText =
            "it seems that we created/updated the signal but couldn't check it, please check manually";
          return;
        }
        this.signal = signal;
        this.$router.push({
          path: `/signals/${signal.id}`
        });
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "oops we did something wrong!";
        console.log("error saving signal", error);
      }
    },
    _get: _get
  },
  beforeCreate() {
    if (
      this.$route.params.signalId !== "create" &&
      Number.isInteger(this.$route.params.signalId)
    ) {
      this.$apollo.queries.signal;
    }
  },
  beforeUpdate() {
    if (!this.signal && this.$route.params.signalId !== "create") {
      this.signal = { ...defaultSignal };
    }
  }
};
</script>
