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
          'items-per-page-options': [10, 20, 50],
        }"
        :options.sync="options"
        @updateOptions="updateOptions"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <router-link :to="`/signals/${item.signal.id}`">
                <long-paragraph
                  :text="item.signal.name"
                  :maxLength="45"
                ></long-paragraph>
              </router-link>
            </td>
            <td>
              <long-paragraph
                :text="item.signal.description"
                :maxLength="45"
              ></long-paragraph>
            </td>
            <td>{{ item.signal.group || "--" }}</td>
            <td>{{ item.signal.category || "--" }}</td>
            <td>{{ item.signal.score || "0" }}</td>
            <td>
              <div class="d-flex align-center justify-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon
                        @click="deleteSingal(item)"
                        small
                        color="red lighten-2"
                        >delete</v-icon
                      >
                    </v-btn>
                  </template>
                  <span>Remove signal</span>
                </v-tooltip>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import _get from "lodash.get";
import LongParagraph from "../../common/LongParagraph.vue";
import SignalsAutocomplete from "../../signals/autocomplete/SignalsAutocomplete.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      companySignals: [],
      signalId: null,
      currentSignalSearch: null,
      headers: [
        { text: "Name", sortable: false, width: "20%" },
        { text: "Description", sortable: false, width: "20%" },
        { text: "Group", sortable: false, width: "20%" },
        { text: "Category", sortable: false, width: "20%" },
        { text: "Score", sortable: false, width: "10%" },
        { text: "Remove", sortable: false, align: "center", width: "10%" },
      ],
      options: {
        page: 1,
        itemsPerPage: 10,
      },
    };
  },
  apollo: {
    companySignals: {
      query: gql`
        query companySignals($companyUid: String, $first: Int, $offset: Int) {
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
                score
              }
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
            this.options.itemsPerPage,
        };
      },
      fetchPolicy: "cache-and-network",
    },
  },
  methods: {
    updateOptions({
      dataFromEvent: {
        page = 1,
        itemsPerPage = 10,
        sortBy = [],
        sortDesc = [],
      },
    }) {
      this.options.page = options.page;
      this.options.itemsPerPage = options.itemsPerPage;
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
    addSignalToCompany() {
      try {
        if (!!this.signalId || !!this.currentSignalSearch) {
          if (!!this.signalId) {
            console.log("this.signalId", this.signalId);
            this.$apollo
              .mutate({
                mutation: gql`
                  mutation($signalId: Int!, $companyUid: String!) {
                    createCompanySignal(
                      companySignalData: {
                        signalId: $signalId
                        companyUid: $companyUid
                      }
                    ) {
                      companySignal {
                        id
                        company {
                          name
                          uid
                        }
                        signal {
                          id
                          name
                          description
                          group
                          category
                          score
                        }
                      }
                    }
                  }
                `,
                // Parameters
                variables: {
                  signalId: this.signalId,
                  companyUid: this.$route.params.companiesUid,
                },
              })
              .then((result) => {
                console.log("result", result);
                if (!!result && !!result.data.createCompanySignal) {
                  this.companySignals.totalResults += 1;
                  this.companySignals.companySignalsList.push(
                    result.data.createCompanySignal.companySignal
                  );
                  const newSignalId = _get(
                    result,
                    "data.createCompanySignal.companySignal.signal.id",
                    null
                  );
                  console.log("newSignalId", newSignalId);
                  if (!newSignalId) {
                    this.$eventBus.$emit(
                      "showSnack",
                      "Oops!! we did something wrong when saving the company - signal, please try again!!",
                      "error"
                    );
                    return;
                  }
                  this.$eventBus.$emit(
                    "showSnack",
                    "New signal successfully created!!",
                    "success"
                  );
                  return;
                }
              });
          } else {
            this.$apollo
              .mutate({
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
                        score: $score
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
                        score
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
                  score: 1,
                },
              })
              .then((result) => {
                console.log("result", result);
                const newSignal = _get(
                  result,
                  "data.createSignal.signal",
                  null
                );
                if (!newSignal) {
                  console.log("hola5");
                  this.$eventBus.$emit(
                    "showSnack",
                    "Oops!! we did something wrong when creating a new signal!!!",
                    "error"
                  );
                  return;
                }
                console.log("newSignal", newSignal);
              });
            this.$apollo.mutate({
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
                        description
                        group
                        category
                        score
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
                companyUid: this.$route.params.companiesUid,
              },
            });
            then((result) => {
              console.log("result", result);
              if (!!result && !!result.data.createCompanySignal) {
                this.companySignals.totalResults += 1;
                this.companySignals.companySignalsList.push(
                  result.data.createCompanySignal.companySignal
                );
                const newCompanySignal = _get(
                  result,
                  "data.createCompanySignal.companySignal",
                  null
                );
                if (!newCompanySignal) {
                  this.$eventBus.$emit(
                    "showSnack",
                    "Oops!! we did something wrong when creating the new CompanySignal, please try again!!",
                    "error"
                  );
                  return;
                }
                this.$eventBus.$emit(
                  "showSnack",
                  "New signal successfully created!!",
                  "success"
                );
                return;
              }
            });
          }
        } else {
          this.$eventBus.$emit("showSnack", "Select a signal first", "error");
          return;
        }
      } catch (error) {
        this.$eventBus.$emit(
          "showSnack",
          "Oops we did something wrong!!",
          "error"
        );
        console.log("error adding signal to company", error);
      }
    },
    async deleteSingal(signal) {
      console.log("signal", signal);
      const res = await this.$confirm(
        `<h1 class="subtitle-1">
              Confirm you want to eliminate the signal
              <span class="font-weight-bold"
              >${signal.signal.name}</span>?
            </h1> `,
        {
          buttonTrueText: "delete",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "primary",
          icon: "delete",
          title: "Delete signal",
          width: 600,
        }
      );
      if (res) {
        try {
          const index = this.companySignals.companySignalsList.indexOf(signal);
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
              signalId: parseInt(signal.signal.id),
              companyUid: this.$route.params.companiesUid,
            },
          });
          console.log("result", result);
          const companySignalId = _get(
            result,
            "data.deleteCompanySignal.companySignal.id",
            null
          );
          this.companySignals.companySignalsList.splice(index, 1);
          this.companySignals.totalResults -= 1;
          this.$eventBus.$emit(
            "showSnack",
            "The signal successfully delete!!",
            "success"
          );
        } catch (error) {
          console.log("error", error);
          this.$eventBus.$emit(
            "showSnack",
            "Oops!! we did something wrong when removing the company - signal, please try again!!",
            "error"
          );
          return;
        }
      }
    },
  },
  components: {
    LongParagraph,
    SignalsAutocomplete,
  },
  beforeUpdate() {
    this.$apollo.queries.companySignals;
  },
};
</script>
<style></style>
