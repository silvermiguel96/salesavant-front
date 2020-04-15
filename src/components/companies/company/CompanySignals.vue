<template>
  <v-card v-if="company" style="height:100%;" class="pa-3">
    <v-card-text>
      <!-- The first table -->
      <div>
        <div class="title text-capitalize font-weight-regular grey--text">Groups</div>
        <v-data-table
          v-if="company && company.signalGroupAggs"
          :headers="headersTable1"
          :items="company.signalGroupAggs"
          :sort-by="['score']"
          :sort-desc="[true]"
          dense
          hide-default-footer
        >
          <template v-slot:items="props">
            <td>{{ props.item.groupName || "--" }}</td>
            <td>{{ props.item.count }}</td>
            <td class="text-xs-right">{{ props.item.score }}</td>
          </template>
        </v-data-table>
      </div>

      <!-- Second Table -->
      <div class="mt-8">
        <div class="title text-capitalize font-weight-regular grey--text">Signals</div>
        <v-data-table
          v-if="companySignals"
          :headers="headers"
          :items="companySignals.companySignalsList"
          :sort-by="['score']"
          :sort-desc="[true]"
          dense
          hide-default-footer
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.signal.group || "--" }}</td>
              <td>
                <long-paragraph :text="item.signal.name " :maxLength="35"></long-paragraph>
              </td>
              <td>{{ item.score || "--" }}</td>
            </tr>
          </template>
        </v-data-table>
      </div>
      
    </v-card-text>
  </v-card>
</template>
<script>
import LongParagraph from "../../common/LongParagraph.vue";
import gql from "graphql-tag";
import _get from "lodash.get";
export default {
  data() {
    return {
      options: {
        page: 1,
        itemsPerPage: 10
      },
      signalId: null,
      currentSignalSearch: null,
      company: "",
      signalGroupAggs: null,
      companySignals: null,
      keywords: [],
      headersTable1: [
        { text: "Group", value: "groupName", sortable: false },
        { text: "Total", value: "count", sortable: false },
        { text: "Score", value: "score", sortable: true }
      ],
      headers: [
        { text: "Group", value: "signal.group", sortable: false },
        { text: "Signal", value: "signal.name", sortable: false },
        { text: "Score", value: "score", sortable: true },
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
      fetchPolicy: "no-cache"
    }
  },
  components: {
    LongParagraph
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
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
    refreshData() {
      this.$apollo.queries.company.refresh();
      this.$apollo.queries.companySignals.refresh();
    },
    async addSignalToCompany() {
      try {
        if (!!this.signalId || !!this.currentSignalSearch) {
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
              this.$eventBus.$emit("showSnack", "Oops!! we did something wrong when saving the company - signal, please try again!!", "error");
              return;
            }
            this.refreshData();
            this.$eventBus.$emit("showSnack", "New signal successfully created!!", "success");
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
              this.$eventBus.$emit("showSnack", "Oops!! we did something wrong when creating a new signal!!!", "error");
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
              this.$eventBus.$emit("showSnack", "Oops!! we did something wrong when creating the new CompanySignal, please try again!!", "error");
              return;
            }
            this.refreshData();
            this.$eventBus.$emit("showSnack", "New signal successfully created!!", "success");
            return;
          }
        } else {
          console.log("hola5");
          this.$eventBus.$emit("showSnack", "Select a signal first", "error");
          return;
        }
      } catch (error) {
        this.$eventBus.$emit("showSnack", "Oops we did something wrong!!", "error");
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
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
</style>
