<template>
  <v-container fluid>
    <v-card>
      <v-row no-gutters>
        <v-col cols="12" xs="12" class="pt-0">
          <v-row no-gutters>
            <v-breadcrumbs
              :large="true"
              v-if="!!this.$route.params.signalId"
              :items="[
                {
                  text: 'Signals',
                  disabled: false,
                  href: '/signals',
                },
                {
                  text: signal.name || this.$route.params.signalId,
                  disabled: true,
                  href: `/signals/${this.$route.params.signalId}`,
                },
              ]"
              divider=">"
            ></v-breadcrumbs>
            <v-breadcrumbs
              v-else
              class="pl-3 pl-sm-6"
              :large="true"
              :items="[
                {
                  text: 'Signals',
                  disabled: false,
                  href: '/signals',
                },
              ]"
              divider=">"
            ></v-breadcrumbs>
          </v-row>
          <v-row class="mx-4" no-gutters>
            <v-col cols="12">
              <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field
                      id="field-name"
                      v-model="signal.name"
                      label="Name"
                      :rules="nameRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      id="field-description"
                      v-model="signal.description"
                      label="Description"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      id="field-score"
                      v-model="signal.score"
                      label="Score"
                      :rules="scoreRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field id="field-group" v-model="signal.group" label="Group"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-checkbox v-model="signal.autoUpdate" label="Auto Update"></v-checkbox>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="3">
                    <v-btn
                      type="submit"
                      @click="save"
                      class="text-capitalize"
                      color="primary"
                      block
                      :disabled="!valid"
                    >
                      <v-icon small class="pr-1">{{ !!signal.id ? "save" : "add" }}</v-icon>
                      {{ !!signal.id ? "Update" : "Create" }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
          <v-row class="mx-2" no-gutters>
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
                class="mx-2"
                @updateOptions="updateOptions"
              ></company-signals>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
import companySignals from "../../components/signals/SignalCompanyTable.vue";

export default {
  data() {
    return {
      valid: true,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: "",
      },
      signal: {
        name: "",
        group: "",
        category: "",
        description: "",
        score: "",
        autoUpdate: false,
      },
      scoreRules: [(v) => !!v || "Score is required"],
      nameRules: [(v) => !!v || "Name is required"],
      companySignals: [],
    };
  },
  components: {
    companySignals,
  },
  props: {
    score: { type: Number, default: 0 },
    name: { type: String, default: "" },
    jobUid: { type: String, default: "" },
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
            score
            autoUpdate
          }
        }
      `,
      variables() {
        return {
          signalId: this.$route.params.signalId,
        };
      },
      fetchPolicy: "cache-and-network",
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
              modificationTime
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
          sortOrder: this.options.sortOrder,
        };
      },
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
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
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
                $autoUpdate: Boolean
              ) {
                updateSignal(
                  signalData: {
                    name: $name
                    description: $description
                    group: $group
                    category: $category
                    score: $score
                    autoUpdate: $autoUpdate
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
                    score
                    creationTime
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
              score: this.signal.score,
              autoUpdate: this.signal.autoUpdate,
            },
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
                $autoUpdate: Boolean
              ) {
                createSignal(
                  signalData: {
                    name: $name
                    description: $description
                    group: $group
                    category: $category
                    score: $score
                    autoUpdate: $autoUpdate
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
              name: this.signal.name,
              description: this.signal.description,
              group: this.signal.group,
              category: this.signal.category,
              score: this.signal.score,
              autoUpdate: this.signal.autoUpdate,
            },
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
          path: `/signals`,
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
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        console.log("here");
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation($jobUid: String!, $keyword: String!, $score: Int) {
              createSignalFromPlaylistKeyword(
                jobUid: $jobUid
                keyword: $keyword
                score: $score
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
            keyword: this.signal.name,
            jobUid: this.$props.jobUid,
            score: this.signal.score,
          },
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
          path: `/signals/${signal.id}`,
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
    _get: _get,
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
  },
};
</script>
