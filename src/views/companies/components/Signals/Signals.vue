<template>
  <v-card>
    <v-card-text class="mx-2">
      <v-row>
        <v-col xl="11" lg="10" md="10" xs="12" sm="9" cols="12">
          <signals-autocomplete
            :placeholder="'Add signal'"
            @change="onSignalAutoCompleteChange"
            @onSearch="onSignalAutoCompleteSearch"
          />
        </v-col>
        <v-col xl="1" lg="2" md="2" xs="12" sm="3" cols="12">
          <v-btn
            color="primary"
            block
            class="text-capitalize mt-3"
            @click="addSignalToCompany"
            :disabled="!signalId && !currentSignalSearch"
          >
            <v-icon small>add</v-icon>Add Signal
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text class="mx-2">
      <v-data-table
        :headers="headers"
        :items="companySignals.companySignalsList"
        :server-items-length="companySignals.totalResults"
        :items-per-page="options.itemsPerPage"
        :footer-props="{
          'items-per-page-options': [10, 20, 50]
        }"
        :options.sync="options"
        @updateOptions="updateOptions"
      >
        <template v-slot:item="{ item, headers }">
          <tr>
            <td>
              <router-link :to="`/signals/${item.signal.id}`">
                <long-paragraph :text="item.signal.name" :maxLength="45"></long-paragraph>
              </router-link>
            </td>
            <td>
              <long-paragraph :text="item.signal.description" :maxLength="45"></long-paragraph>
            </td>
            <td>{{ item.signal.group || "--" }}</td>
            <td>{{ item.signal.category || "--" }}</td>
            <td>{{ item.score || "0" }}</td>
            <td>
              <v-dialog v-model="dialog" max-width="600px">
                <v-card>
                  <v-card-title class="headline">Delete signal</v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <h1 class="subtitle-1">Do you want to eliminate the signal?</h1>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="grey darken-1"
                      class="text-capitalize"
                      text
                      @click="dialog = false"
                    >Close</v-btn>
                    <v-btn
                      color="red darken-1"
                      class="text-capitalize"
                      text
                      @click="deleteItem({
                        item: item,
                        signalId: item.signal.id
                      })"
                    >Delete</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-icon @click="dialog = true" small color="red">delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import _get from "lodash.get";
import LongParagraph from "../../../../components/common/LongParagraph.vue";
import SignalsAutocomplete from "../../../../components/signals/SignalsAutocomplete.vue";
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
        { text: "Name", sortable: false, width: "20%" },
        { text: "Description", sortable: false, width: "20%" },
        { text: "Group", sortable: false, width: "20%" },
        { text: "Category", sortable: false, width: "20%" },
        { text: "Score", sortable: false, width: "10%" },
        { text: "Actions", sortable: false, align: "left", width: "10%" }
      ],
      dialog: ""
    };
  },
  apollo: {
    companySignals: {
      query: gql`
        query searchCompanySignals(
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
      try {
        if (!!this.signalId || !!this.currentSignalSearch) {
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
          this.snack = true;
          this.snackColor = "error";
          this.snackText = "Select a signal first";
          return;
        }
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Oops we did something wrong!!";
        console.log("error adding signal to company", error);
      }
    },
    async deleteItem({ item = null, signalId = null }) {
      try {
        console.log({ item, signalId });
        const index = this.companySignals.companySignalsList.indexOf(item);
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
        this.companySignals.companySignalsList.splice(index, 1);
        this.refreshData();
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText =
          "Oops!! we did something wrong when removing the company - signal, please try again!!";
        return;
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
