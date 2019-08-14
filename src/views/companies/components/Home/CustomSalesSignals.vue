<template>
  <v-card v-if="company">
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-card-title>
      <h1 class="display-1">Custom Sales Signals</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-actions default>
      <v-icon large color="blue">info</v-icon>
      <h2 class="headline font-weight-bold">Custome Score:</h2>
      <p class="headline">{{company.totalScore || '--'}}</p>
    </v-card-actions>
    <v-card-text>
      <!-- The first table -->
      <v-data-table
        v-if="company && company.signalGroupAggs"
        :headers="headersTable1"
        :items="company.signalGroupAggs"
        class="elevation-1"
        hide-actions
      >
        <template v-slot:items="props">
          <td>{{ props.item.groupName || '[empty group name]' }}</td>
          <td>{{ props.item.count }}</td>
          <td class="text-xs-right">{{ props.item.score }}</td>
        </template>
      </v-data-table>

      <!-- Second Table -->
      <v-divider />

      <v-data-table
        v-if="companySignals"
        :headers="headers"
        :items="companySignals"
        class="elevation-1 mt-5"
        hide-actions
      >
        <template v-slot:items="props">
          <td>{{ props.item.signal.group || '[empty group name]' }}</td>
          <td>{{ props.item.signal.name || '[empty signal name]' }}</td>
          <td>{{ props.item.score || '--' }}</td>
          <td class="justify-center layout px-0">
            <v-icon
              small
              @click="deleteItem({item: props.item, signalId:props.item.signal.id})"
            >delete</v-icon>
          </td>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
    </v-card-text>
    <!-- Add Signal -->
    <v-card-text>
      <v-layout row>
        <v-flex md9 lg10>
          <signals-autocomplete
            :placeholder="'Add signal'"
            @change="onSignalAutoCompleteChange"
            @onSearch="onSignalAutoCompleteSearch"
          />
        </v-flex>
        <v-flex sm3 lg2>
          <v-btn @click="addSignalToCompany" :disabled="!signalId && !currentSignalSearch">
            <v-icon left>add</v-icon>Add
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
    <!-- List singal -->
    <v-card-text>
      <v-data-table :headers="Hkeywords" hide-actions></v-data-table>
      <template>
        <td></td>
      </template>
    </v-card-text>
  </v-card>
</template>
<script>
import gql from "graphql-tag";
import SignalsAutocomplete from "../../../../components/signals/Autocomplete.vue";
import _get from "lodash.get";
export default {
  data() {
    return {
      signalId: null,
      currentSignalSearch: null,
      company: [],
      signalGroupAggs: null,
      companySignals: null,
      snack: false,
      snackColor: "",
      snackText: "",
      headersTable1: [
        {
          text: "Group",
          value: "groupName",
          sortable: true
        },
        {
          text: "Total",
          value: "count",
          sortable: true
        },
        {
          text: "Score",
          value: "score",
          sortable: true
        }
      ],
      headers: [
        {
          text: "Group",
          value: "signal.group",
          sortable: true
        },
        {
          text: "Signal",
          value: "signal.name",
          sortable: true
        },
        {
          text: "Score",
          value: "score",
          sortable: true
        },
        {
          text: "Actions",
          value: "name",
          sortable: false
        }
      ],
      desserts: [],
      Hkeywords: [
        {
          text: "Keywords",
          value: "ketwords"
        },
        {
          text: "Score",
          value: "score"
        }
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
        query getSignalsForSingleCompany($companyUid: String) {
          companySignals(companyUid: $companyUid, first: 10000) {
            signal {
              id
              name
              category
              group
            }
            score
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid
        };
      },
      fetchPolicy: "no-cache"
    }
  },
  components: {
    SignalsAutocomplete
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.desserts = [
        {
          group: "None",
          signal: "High Momentum",
          score: 1
        },
        {
          group: "None",
          signal: "High Momentum",
          score: 2
        }
      ];
    },
    async deleteItem({ item = null, signalId = null }) {
      try {
        console.log({ item, signalId });
        const index = this.companySignals.indexOf(item);
        const isConfirmed = confirm(
          "Are you sure you want to delete this item?"
        );
        if (isConfirmed) {
          const result = await this.$apollo.mutate({
            mutation: gql`
              mutation($signalId: Int!, $companyUid: String!) {
                deleteCompanySignal(
                  companyUid: $companyUid
                  signalId: $signalId
                ) {
                  companySignal {
                    id
                  }
                }
              }
            `,
            // Parameters
            variables: {
              signalId,
              companyUid: this.$route.params.companiesUid
            }
          });
          console.log("result", result);
          const companySignalId = _get(
            result,
            "data.deleteCompanySignal.companySignal.id",
            null
          );
          if (!companySignalId) {
            this.snack = true;
            this.snackColor = "error";
            this.snackText =
              "Oops!! something happened when trying to remove the company - signal, please review manually or try again!!";
            return;
          }
          this.companySignals.splice(index, 1);
          this.refreshData();
        }
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText =
          "Oops!! we did something wrong when removing the company - signal, please try again!!";
        return;
      }
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
    refreshData() {
      this.$apollo.queries.company.refresh();
      this.$apollo.queries.companySignals.refresh();
    },
    async addSignalToCompany() {
      console.log("hola");
      try {
        console.log("hola2");
        if (!!this.signalId || !!this.currentSignalSearch) {
          console.log("hola3");
          if (!!this.signalId) {
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
                signalId: newSignal.id,
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
  beforeCreate() {
    this.$apollo.queries.company;
    this.$apollo.queries.companySignals;
  }
};
</script>
<style scoped>
.v-card__actions {
  margin: 1em;
}
</style>
