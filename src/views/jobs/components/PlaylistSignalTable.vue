<template>
  <div>
    <v-card>
      <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
        {{ snackText }}
        <v-btn text @click="snack = false">Close</v-btn>
      </v-snackbar>
      <v-form @submit.prevent>
        <v-container>
          <v-subheader>Signal details</v-subheader>
          <v-layout>
            <v-flex xs12 md4>
              <v-text-field v-model="name" label="Name" required :disabled="!canModifySignalName"></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field v-model="description" label="Description" required></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field v-model="score" label="Score" required></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field v-model="group" label="Group" required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 md4>
              <v-btn
                v-if="!canModifySignalName"
                type="submit"
                color="primary"
                @click="saveKeyWordsAsSignal"
              >Save from playlist keywords</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";

export default {
  data() {
    return {
      snack: false,
      snackColor: "",
      snackText: "",
      group: "",
      description: "",
      companySignals: []
    };
  },
  props: {
    score: { type: Number, default: 0 },
    name: { type: String, default: "" },
    jobUid: { type: String, default: "" },
    canModifySignalName: { type: Boolean, default: true }
  },
  methods: {
    async saveKeyWordsAsSignal() {
      if (!this.name) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Name can not be empty!";
        return;
      }
      if (!this.score) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Score can not be empty!";
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
            mutation(
              $jobUid: String!
              $keyword: String!
              $defaultScore: Int
              $group: String!
              $description: String!
            ) {
              createSignalFromPlaylistKeyword(
                jobUid: $jobUid
                keyword: $keyword
                defaultScore: $defaultScore
                group: $group
                description: $description
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
            keyword: this.name,
            jobUid: this.$props.jobUid,
            defaultScore: this.score,
            group: this.group,
            description: this.description
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
  }
};
</script>