<template>
  <v-container fluid class="py-0">
    <v-row>
      <v-col cols="12" xs="12">
        <v-card>
          <v-row no-gutters>
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
            text: signal.name || this.$route.params.signalId,
            disabled: true,
            href: `/signals/${this.$route.params.signalId}`
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
            disabled: false,
            href: '/signals'
          }
        ]"
              divider=">"
            ></v-breadcrumbs>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-form @submit.prevent>
                <v-container fluid>
                  <v-row class="px-3" dense>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="signal.name"
                        label="Name"
                        required
                        :disabled="!canModifySignalName"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="signal.description" label="Description" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="signal.defaultScore" label="Score" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="signal.group" label="Group" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="2" lg="2">
                      <v-btn
                        v-if="canModifySignalName"
                        type="submit"
                        @click="save"
                        class="text-capitalize"
                        color="primary"
                        block
                      >
                        <v-icon small class="pr-1">
                          {{
                          !!signal.id ? "save" : "add"
                          }}
                        </v-icon>
                        {{ !!signal.id ? "Update" : "Create" }}
                      </v-btn>
                      <v-btn
                        v-else
                        type="submit"
                        color="primary"
                        @click="saveKeyWordsAsSignal"
                      >Save from playlist keywords</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-col>
          </v-row>
          <v-row no-gutters v-if="canModifySignalName">
            <v-col
              cols="12"
              v-if="
                  !!this.$route.params.signalId &&
                    this.$route.params.signalId !== 'create'
                "
            >
              <!-- Result -->
              <company-signals
                v-if="signalCompanies"
                :items="signalCompanies.companiesList"
                :totalResults="signalCompanies.totalResults"
                class="result apollo"
                @updateOptions="updateOptions"
              ></company-signals>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
import companySignals from "../../components/signals/SignalCompanyTable.vue";

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
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: ""
      },
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
    signal: {
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
    },
    signalCompanies: {
      query: gql`
        query getSignalsById(
          $signalId: Int
          $first: Int
          $offset: Int
          $sortBy: String
          $sortOrder: String
        ) {
          signalCompanies(
            signalId: $signalId
            first: $first
            offset: $offset
            sortBy: $sortBy
            sortOrder: $sortOrder
          ) {
            totalResults
            companiesList {
              uid
              name
              numEmployees
              totalScore
              country
              state
              creationTime
            }
          }
        }
      `,
      variables() {
        return {
          signalId: parseInt(this.$route.params.signalId),
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage,
          sortBy: this.options.sortBy,
          sortOrder: this.options.sortOrder
        };
      },
    }
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
      if (sortBy.length > 0) {
        switch (sortBy[0]) {
          case "totalScore":
            this.options.sortBy = "score";
            break;
          case "numEmployees":
            this.options.sortBy = "employees";
            break;
        }
      } else {
        this.options.sortBy = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.options.sortOrder = "desc";
        } else {
          this.options.sortOrder = "asc";
        }
      } else {
        this.options.sortOrder = "";
      }
    },
    async save() {
      if (!this.signal) {
        this.$eventBus.$emit(
          "showSnack",
          "There's something wrong with the signal saving!",
          "error"
        );
        return;
      }
      if (!this.signal.name) {
        this.$eventBus.$emit("showSnack", "Name can not be empty!", "error");
        return;
      }
      if (!this.signal.description) {
        this.$eventBus.$emit(
          "showSnack",
          "Description can not be empty!",
          "error"
        );
        return;
      }
      if (!this.signal.defaultScore) {
        this.$eventBus.$emit("showSnack", "Score can not be empty!", "error");
        return;
      }
      if (!this.signal.group) {
        this.$eventBus.$emit("showSnack", "Group can not be empty!", "error");
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
          this.$eventBus.$emit(
            "showSnack",
            "The signals are updated successfully!",
            "success"
          );
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
          this.$eventBus.$emit(
            "showSnack",
            "The signals are saving successfully!",
            "success"
          );
          console.log("saving signal success", result);
        }
        const signal =
          _get(result, "data.createSignal.signal", null) ||
          _get(result, "data.updateSignal.signal", null);
        if (!signal) {
          this.$eventBus.$emit(
            "showSnack",
            "it seems that we created/updated the signal but couldn't check it, please check manually",
            "error"
          );
          return;
        }
        this.signal = signal;
        this.$router.push({
          path: `/signals`
        });
        this.$apollo.queries.signal;
        this.$apollo.queries.companySignals;
      } catch (error) {
        this.$eventBus.$emit(
          "showSnack",
          "oops we did something wrong!",
          "error"
        );
        console.log("error saving signal", error);
      }
    },
    async saveKeyWordsAsSignal() {
      if (!this.signal) {
        this.$eventBus.$emit(
          "showSnack",
          "There's something wrong with the signal saving!",
          "error"
        );
        return;
      }
      if (!this.signal.name) {
        this.$eventBus.$emit("showSnack", "Name can not be empty!", "error");
        return;
      }
      if (!this.signal.description) {
        this.$eventBus.$emit(
          "showSnack",
          "Description can not be empty!",
          "error"
        );
        return;
      }
      if (!this.signal.defaultScore) {
        this.$eventBus.$emit("showSnack", "Score can not be empty!", "error");
        return;
      }
      if (!this.signal.group) {
        this.$eventBus.$emit("showSnack", "Group can not be empty!", "error");
        return;
      }
      if (!this.$props.jobUid) {
        this.$eventBus.$emit("showSnack", "JobUid can not be empty!", "error");
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
        this.$eventBus.$emit(
          "showSnack",
          "The signals are saving successfully!",
          "success"
        );
        console.log("saving signal success", result);
        this.$router.push("/signal");
        const signal = _get(
          result,
          "data.createSignalFromPlaylistKeyword.signal",
          null
        );

        console.log("signal", signal);
        if (!signal) {
          this.$eventBus.$emit(
            "showSnack",
            "it seems that we created/updated the signal but couldn't check it, please check manually",
            "error"
          );
          return;
        }
        this.signal = signal;
        this.$router.push({
          path: `/signals/${signal.id}`
        });
      } catch (error) {
        this.$eventBus.$emit(
          "showSnack",
          "oops we did something wrong!",
          "error"
        );
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
    }
  },
  beforeUpdate() {
    if (!this.signal && this.$route.params.signalId !== "create") {
      this.signal = { ...defaultSignal };
    }
  }
};
</script>
