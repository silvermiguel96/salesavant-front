<template>
  <div>
    <v-card class="apollo-example">
      <v-alert :value="showError" dismissible type="error">{{errorMessage}}</v-alert>
      <v-alert :value="showSuccess" dismissible type="success">{{successMessage}}</v-alert>
      <v-breadcrumbs
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
        <v-container>
          <v-subheader>Signal details</v-subheader>
          <v-layout>
            <v-flex xs12 md4>
              <v-text-field
                v-model="signal.name"
                label="Name"
                required
                :disabled="!canModifySignalName"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field v-model="signal.description" label="Description" required></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field v-model="signal.defaultScore" label="Score" required></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field v-model="signal.group" label="Group" required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 md4>
              <v-btn
                v-if="canModifySignalName"
                type="submit"
                color="primary"
                @click="save"
              >{{!!signal.id ? "Update" : "Create"}}</v-btn>
              <v-btn
                v-else
                type="submit"
                color="primary"
                @click="saveKeyWordsAsSignal"
              >Save from playlist keywords</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card>
    <v-card v-if="canModifySignalName">
      <v-card-title>Related companies</v-card-title>
      <v-container>
        <v-data-table :headers="headers" :items="signal.companies" class="elevation-1">
          <template v-slot:items="props">
            <td>
              <router-link
                :to="`/companies/${props.item.company.uid}`"
              >{{ props.item.company.name || "--" }}</router-link>
            </td>
          </template>
        </v-data-table>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
import { setTimeout, setInterval } from "timers";

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
  data: () => ({
    signal: { ...defaultSignal },
    errorMessage: "",
    showError: false,
    showSuccess: false,
    successMessage: "",
    headers: [
      {
        text: "Company name",
        sortable: false,
        value: "name"
      }
    ]
  }),
  props: {
    score: { type: Number, default: 0 },
    name: { type: String, default: "" },
    jobUid: { type: String, default: "" },
    canModifySignalName: { type: Boolean, default: true }
  },
  methods: {
    async getSignal() {
      let signal = { ...defaultSignal };
      const signalId = _get(this, "$route.params.signalId", null);
      if (!!signalId) {
        try {
          const result = await this.$apollo.query({
            query: gql`
              query($id: Int) {
                signal(id: $id) {
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
                  companies {
                    company {
                      uid
                      name
                    }
                  }
                }
              }
            `,
            // Parameters
            variables: {
              id: signalId
            }
          });
          console.log("signal result", result);
          signal = _get(result, "data.signal", null);
          if (!signal) {
            this.errorMessage =
              "oops we did something wrong when trying to get the signal from the database";
            this.showError = true;
            setTimeout(() => {
              this.showError = false;
            }, 5000);
            return;
          }
          this.signal = { ...signal };
        } catch (error) {
          this.errorMessage = "oops we did something wrong!!";
          this.showError = true;
          setTimeout(() => {
            this.showError = false;
          }, 5000);
          console.log("error trying to query signal", error);
        }
      } else {
        this.signal = {
          ...signal,
          name: this.$props.name,
          defaultScore: this.$props.score
        };
      }
    },
    async save() {
      if (!this.signal) {
        this.errorMessage = "There's something wrong with the signal saving!";
        this.showError = true;
        return;
      }
      if (!this.signal.name) {
        this.errorMessage = "Name can not be empty!";
        this.showError = true;
        return;
      }
      if (!this.signal.description) {
        this.errorMessage = "Description can not be empty!";
        this.showError = true;
        return;
      }
      if (!this.signal.defaultScore) {
        this.errorMessage = "Score can not be empty!";
        this.showError = true;
        return;
      }
      if (!this.signal.group) {
        this.errorMessage = "Group can not be empty!";
        this.showError = true;
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
          this.successMessage = "The signals are updated successfully!";
          this.showSuccess = true;
          setTimeout(() => {
            this.showSuccess = false;
          }, 5000);
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
          this.successMessage = "The signals are saving successfully!";
          this.showSuccess = true;
          setTimeout(() => {
            this.showSuccess = false;
          }, 5000);
          console.log("saving signal success", result);
        }
        const signal =
          _get(result, "data.createSignal.signal", null) ||
          _get(result, "data.updateSignal.signal", null);
        if (!signal) {
          this.errorMessage =
            "it seems that we created/updated the signal but couldn't check it, please check manually";
          this.showError = true;
          return;
        }
        this.signal = signal;
        this.$router.push({
          path: `/signals/${signal.id}`
        });
        this.getSignal();
      } catch (error) {
        this.errorMessage = "oops we did something wrong!";
        this.showError = true;
        console.log("error saving signal", error);
      }
    },
    async saveKeyWordsAsSignal() {
      if (!this.signal) {
        this.errorMessage = "There's something wrong with the signal saving!";
        this.showError = true;
        return;
      }
      if (!this.signal.name) {
        this.errorMessage = "Name can not be empty!";
        this.showError = true;
        return;
      }
      if (!this.signal.description) {
        this.errorMessage = "Description can not be empty!";
        this.showError = true;
        return;
      }
      if (!this.signal.defaultScore) {
        this.errorMessage = "Score can not be empty!";
        this.showError = true;
        return;
      }
      if (!this.signal.group) {
        this.errorMessage = "Group can not be empty!";
        this.showError = true;
        return;
      }
      if (!this.$props.jobUid) {
        this.errorMessage = "JobUid can not be empty!";
        this.showError = true;
        return;
      }
      try {
        console.log("here");
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation($jobUid: String!, $keyword: String!) {
              createSignalFromPlaylistKeyword(
                jobUid: $jobUid
                keyword: $keyword
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
            jobUid: this.$props.jobUid
          }
        });
        this.successMessage = "The signals are saving successfully!";
        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
        }, 5000);
        console.log("saving signal success", result);

        const signal = _get(
          result,
          "data.createSignalFromPlaylistKeyword.signal",
          null
        );

        console.log("signal", signal);
        if (!signal) {
          this.errorMessage =
            "it seems that we created/updated the signal but couldn't check it, please check manually";
          this.showError = true;
          return;
        }
        this.signal = signal;
        this.$router.push({
          path: `/signals/${signal.id}`
        });
        this.getSignal();
      } catch (error) {
        this.errorMessage = "oops we did something wrong!";
        this.showError = true;
        console.log("error saving signal", error);
      }
    }
  },
  beforeMount() {
    this.getSignal();
  }
};
</script>
