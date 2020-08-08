<template>
  <v-card>
    <v-form @submit.prevent>
      <v-container>
        <v-subheader>Signal Data</v-subheader>
        <v-container>
            <v-row>
                <v-col cols="12" md="6" >
                    <v-text-field v-model="name" label="Name" required :disabled="!canModifySignalName"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" >
                    <v-text-field v-model="description" label="Description" required></v-text-field>
                </v-col>
            </v-row>    
            <v-row>
                <v-col cols="12" md="6" >
                    <v-text-field v-model="score" label="Score" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6" >
                    <v-text-field v-model="group" label="Group" required></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <v-btn type="submit" color="primary" @click="saveSignal">Save Signal</v-btn>
                </v-col>
            </v-row>
        </v-container>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";

export default {
  data() {
    return {
      name: this.initialName,
      description: "",
      score: "",
      group: ""
    };
  },
  props: {
    initialName: String,
    canModifySignalName: { type: Boolean, default: true }
  },
  methods: {
    async saveSignal() {
      try {
        console.log("here");
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $jobUid: String!
              $keyword: String!
              $score: Int
              $group: String!
              $description: String!
            ) {
              createSignalFromPlaylistKeyword(
                jobUid: $jobUid
                keyword: $keyword
                score: $score
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
                  score
                  modificationTime
                }
              }
            }
          `,
          // Parameters
          variables: {
            keyword: this.name,
            jobUid: this.$props.jobUid,
            score: this.score,
            group: this.group,
            description: this.description
          }
        });
        console.log("saving signal success", result);

        const signal = _get(
          result,
          "data.createSignalFromPlaylistKeyword.signal",
          null
        );

        console.log("signal", signal);
        this.signal = signal;
        this.$router.push({
          path: `/signals/${signal.id}`
        });
      } catch (error) {
        console.log("error saving signal", error);
      }
    },
    _get: _get
  }
};
</script>