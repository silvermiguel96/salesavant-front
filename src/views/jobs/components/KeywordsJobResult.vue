<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="600">
    <template v-slot:activator="{ on }">
      <a v-on="on" href="#">View</a>
    </template>
    <v-card>
      <v-card-title style="padding-left:16px;">Playlist Keywords</v-card-title>
      <v-card-subtitle>{{ additionalDataParsed.playlist_name }}</v-card-subtitle>
      <v-divider class="mx-4"></v-divider>
      <v-card-text>
        <v-data-table
          v-if="!!job"
          :headers="headers"
          :items="keywords"
          :footer-props="{
            'items-per-page-options': [10, 20, 50]
          }"
        >
          <template v-slot:item="{item}">
            <tr>
              <td>{{ item.keyword }}</td>
              <td>{{ item.total }}</td>
              <td>{{ item.score }}</td>
              <td>
                <v-btn text icon color="primary" @click="saveSignal(item)">
                  <v-icon >add_circle_outline</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog=false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _get from "lodash.get";
import gql from "graphql-tag";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      dialog: false,
      headers: [
        { text: "Keyword", align: "left", width: "60%",  sortable: false },
        { text: "Total", align: "left", width: "16%", sortable: true },
        { text: "Score", align: "left", width: "16%", sortable: true },
        { text: "Save Signal", align: "center", width: "10%", sortable: false }
      ],
    };
  },
  props: {
    job: Object
  },
  methods: {
    _get: _get,
    async saveSignal(signalData) {
      try {
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation(
              $jobUid: String!
              $keyword: String!
              $defaultScore: Int
              $group: String
              $description: String
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
            jobUid: this.job.uid,
            keyword: _get(signalData, "keyword"),
            defaultScore: parseInt(_get(signalData, "score") | 1)
          }
        });
      } catch (error) {
        console.log("error saving signal", error);
      }
    }
  },
  computed: {
    keywords: function(){
      let result = JSON.parse(this.job.result);
      let keywords = []
      if (!!result.keywords){
          keywords = result.keywords.map((item, idx) => ({
            idx: idx,
            keyword: item[0] || "",
            total: parseInt(item[1] || 0),
            score: parseFloat(item[2] || 0).toFixed(2)
          }));
      }
      return keywords;
    },
    additionalDataParsed: function(){
        if (!!this.job && !! this.job.additionalData){
            return JSON.parse(this.job.additionalData);
        }
    }
  }
};
</script>
