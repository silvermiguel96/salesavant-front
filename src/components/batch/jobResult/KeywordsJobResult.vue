<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="600" @keydown.esc="dialog=false">
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
                <div v-if="item.saved" class="d-flex justify-center">
                  <v-icon color="green">check_circle_outline</v-icon>
                </div>
                <v-btn v-else text icon color="primary" @click="saveSignal(item)">
                  <v-icon>add_circle_outline</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions class="mx-4">
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
        { text: "Keyword", align: "left", width: "60%", sortable: false },
        { text: "Total", align: "left", width: "16%", sortable: true },
        { text: "Score", align: "left", width: "16%", sortable: true },
        { text: "Save Signal", align: "center", width: "10%", sortable: false }
      ]
    };
  },
  props: {
    job: Object
  },
  methods: {
    _get: _get,
    saveSignal(signalData) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($jobUid: String!, $keyword: String!, $score: Int) {
              createSignalFromPlaylistKeyword(
                jobUid: $jobUid
                keyword: $keyword
              ) {
                ok
                message
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
            jobUid: this.job.uid,
            keyword: _get(signalData, "keyword"),
            score: parseInt(_get(signalData, "score") | 1)
          }
        })
        .then(data => {
          const response = data.data.createSignalFromPlaylistKeyword;
          if (response.ok) {
            let keyword = _get(signalData, "keyword");
            this.$eventBus.$emit(
              "showSnack",
              `Signal "${keyword}" created successfully`,
              "success"
            );
            localStorage.setItem("keyword::" + keyword, "saved");
          } else {
            console.log(signalData, "not success", response.message);
          }
        })
        .catch(error => {
          console.log("error saving signal", error);
        });
    },
    keywordIsSaved(keyword) {
      if (localStorage.getItem("keyword::" + keyword)) {
        return true;
      }
      return false;
    }
  },
  computed: {
    keywords: function() {
      let result = JSON.parse(this.job.result);
      let keywords = [];
      if (!!result.keywords) {
        keywords = result.keywords.map((item, idx) => ({
          idx: idx,
          keyword: item[0],
          total: parseInt(item[1] || 0),
          score: parseFloat(item[2] || 0).toFixed(2),
          saved: this.keywordIsSaved(item[0])
        }));
      }
      return keywords;
    },
    additionalDataParsed: function() {
      if (!!this.job && !!this.job.additionalData) {
        return JSON.parse(this.job.additionalData);
      }
      return "";
    }
  }
};
</script>
