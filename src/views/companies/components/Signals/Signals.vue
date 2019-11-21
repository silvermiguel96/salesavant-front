<template>
  <v-card class="ma-3">
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-card-title>
      <h1 class="display-1">Signals</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-layout class="ma-2">
        <v-flex xs11 md11 lg10>
          <signals-autocomplete
            :placeholder="'Add signal'"
            @change="onSignalAutoCompleteChange"
            @onSearch="onSignalAutoCompleteSearch"
          />
        </v-flex>
        <v-flex d-flex align-end xs1 sm2 lg2>
          <v-btn
            class="text-capitalize mx-2"
            small
            @click="addSignalToCompany"
            :disabled="!signalId && !currentSignalSearch"
          >
            <v-icon small>add</v-icon>Add
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="companySignals.companySignalsList"
        :server-items-length="companySignals.totalResults"
        :items-per-page="options.itemsPerPage"
        :footer-props="{
          'items-per-page-options': [10, 20, 50]
        }"
        :options.sync="options"
        class="mx-2"
        @updateOptions="updateOptions"
      >
        <template v-slot:item="{ item, headers }">
          <tr>
            <td>
              <router-link :to="`/signals/${item.signal.id}`">{{
                item.signal.name || "--"
              }}</router-link>
            </td>
            <td>{{ item.signal.description || "--" }}</td>
            <td>{{ item.signal.group || "--" }}</td>
            <td>{{ item.signal.category || "--" }}</td>
            <td>{{ item.signal.defaultScore || "0" }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>

import _get from "lodash.get";
import LongParagraph from "../../../../components/common/LongParagraph.vue";
import SignalsAutocomplete from "../../../../components/signals/Autocomplete.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      options: {
        page: 1,
        itemsPerPage: 10
      },
      companySignals: [],
      signalId: null,
      snack: false,
      snackColor: "",
      snackText: "",
      currentSignalSearch: null,
      descending: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
        { text: "Group", value: "group" },
        { text: "Category", value: "category" },
        { text: "Default Score", value: "defaultScore" }
      ]
    };
  },
  apollo: {
    company: {
      query: gql`
        query getSingleCompany($uid: String) {
          company(uid: $uid) {
            uid
            name
            totalScore
            totalSignals
            signalGroupAggs {
              count
              score
              groupName
            }
          }
        }
      `,
      variables() {
        return {
          uid: this.$route.params.companiesUid
        };
      },
      fetchPolicy: "no-cache"
    },
    companySignals: {
      query: gql`
        query searchCompanyPlaylist(
          $companyUid: String
          $first: Int
          $offset: Int
        ) {
          companySignals(
            companyUid: $companyUid
            first: $first
            offset: $offset
          ) {
            totalResults
            companySignalsList {
              id
              signal {
                id
                name
                description
                group
                category
                defaultScore
              }
              score
            }
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid,
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = options.page;
      this.options.itemsPerPage = options.itemsPerPage;
    },
    refreshData() {
      this.$apollo.queries.companySignals.refresh();
    },
    onSignalAutoCompleteChange(signalResults) {
      this.signalId = _get(signalResults, "signalId", null);
      this.currentSignalSearch = _get(
        signalResults,
        "currentSignalSearch",
        null
      );
    },
    onSignalAutoCompleteSearch(signalResults) {
      this.currentSignalSearch = _get(
        signalResults,
        "currentSignalSearch",
        null
      );
    },
    async addSignalToCompany() {
      console.log("hola");
      try {
        console.log("hola2");
        if (!!this.signalId || !!this.currentSignalSearch) {
          console.log("hola3");
          if (!!this.signalId) {
            console.log("this.signalId", this.signalId);

            const result = await this.$apollo.mutate({
              mutation: gql`
                mutation($score: Float, $signalId: Int!, $companyUid: String!) {
                  createCompanySignal(
                    companySignalData: {
                      score: $score
                      signalId: $signalId
                      companyUid: $companyUid
                    }
                  ) {
                    companySignal {
                      company {
                        name
                        uid
                      }
                      signal {
                        id
                        name
                      }
                      id
                    }
                  }
                }
              `,
              // Parameters
              variables: {
                score: 1,
                signalId: this.signalId,
                companyUid: this.$route.params.companiesUid
              }
            });
            console.log("result", result);
            const newSignalId = _get(
              result,
              "data.createCompanySignal.companySignal.signal.id",
              null
            );
            console.log("newSignalId", newSignalId);
            if (!newSignalId) {
              this.snack = true;
              this.snackColor = "error";
              this.snackText =
                "Oops!! we did something wrong when saving the company - signal, please try again!!";
              return;
            }
            this.refreshData();
            this.snack = true;
            this.snackColor = "success";
            this.snackText = `New signal successfully created!!`;
            return;
          } else {
            const result = await this.$apollo.mutate({
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
                name: this.currentSignalSearch,
                description: "",
                group: "",
                category: "",
                score: 1
              }
            });
            console.log("result", result);
            const newSignal = _get(result, "data.createSignal.signal", null);
            if (!newSignal) {
              console.log("hola5");
              this.snack = true;
              this.snackColor = "error";
              this.snackText =
                "Oops!! we did something wrong when creating a new signal!!!";
              return;
            }
            console.log("newSignal", newSignal);
            const newCompanySignalMutation = await this.$apollo.mutate({
              mutation: gql`
                mutation($score: Float, $signalId: Int!, $companyUid: String!) {
                  createCompanySignal(
                    companySignalData: {
                      score: $score
                      signalId: $signalId
                      companyUid: $companyUid
                    }
                  ) {
                    companySignal {
                      company {
                        name
                        uid
                      }
                      signal {
                        id
                        name
                      }
                      id
                    }
                  }
                }
              `,
              // Parameters
              variables: {
                score: 1,
                signalId: parceInt(newSignal.id),
                companyUid: this.$route.params.companiesUid
              }
            });
            console.log("newCompanySignalMutation", newCompanySignalMutation);
            const newCompanySignal = _get(
              newCompanySignalMutation,
              "data.createCompanySignal.companySignal",
              null
            );
            if (!newCompanySignal) {
              this.snack = true;
              this.snackColor = "error";
              this.snackText =
                "Oops!! we did something wrong when creating the new CompanySignal, please try again!!";
              return;
            }
            this.refreshData();
            this.snack = true;
            this.snackColor = "success";
            this.snackText = `New signal successfully created!!`;
            return;
          }
        } else {
          console.log("hola5");
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "Select a signal first";
          return;
        }
      } catch (error) {
        console.log("hola4");
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Oops we did something wrong!!";
        console.log("error adding signal to company", error);
      }
    }
  },
  components: {
    LongParagraph,
    SignalsAutocomplete
  },
  beforeUpdate() {
    this.$apollo.queries.companySignals;
  }
};
</script>
<style></style>
