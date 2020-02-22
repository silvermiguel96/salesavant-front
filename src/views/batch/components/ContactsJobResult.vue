<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="1000" @keydown.esc="dialog=false">
    <template v-slot:activator="{ on }">
      <a v-on="on" href="#">View</a>
    </template>
    <v-card>
      <v-card-title style="padding-left:16px;">Contact Finder Results</v-card-title>
      <v-card-subtitle>{{ additionalDataParsed.playlist_name }}</v-card-subtitle>
      <v-divider class="mx-4"></v-divider>
      <v-card-text>
        <v-data-table
          v-if="!!job"
          :headers="headers"
          :items="contactFinderResultsParsed"
          :footer-props="{
            'items-per-page-options': [5]
          }"
          :single-expand="true"
          expanded.sync="expanded"
          item-key="id"
          show-expand
        >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length" >
              <div  v-for="candidate in item.candidates" :key="candidate.id">
              <v-row class="ma-2" no-gutters>
                <v-col cols="4">
                  <div>Name: {{ candidate.fullName }}</div>
                  LinkedIn: <a :href="`https://linkedin.com/in/${candidate.linkedinHandle}`" target="_blank">{{ candidate.linkedinHandle }}</a>
                </v-col>
                <v-col cols="4">
                  <div>Title: {{ candidate.title }}</div>
                  <div>Company: {{ candidate.company }}</div>
                </v-col>
                <v-col cols="4">
                  <div>Score: {{ candidate.score }}</div>
                  <v-icon v-if="candidate.score > 70" color="success">check</v-icon>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              </div>
            </td>
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
      contactFinderResults: [],
      expanded: [],
      first: 10,
      offset: 0
    };
  },
  props: {
    job: Object
  },
  methods: {
    _get: _get
  },
  apollo: {
    contactFinderResults: {
      query: gql`
        query contactFinderResults($jobUid: String, $first: Int, $offset: Int) {
          contactFinderResults(
            jobUid: $jobUid
            first: $first
            offset: $offset
          ) {
            totalResults
            inputCompaniesList {
              id
              name
              additionalData
              candidates {
                id
                fullName
                company
                title
                candidateType
                linkedinHandle
                score
              }
            }
          }
        }
      `,
      variables() {
        return {
          jobUid: this.job.uid,
          first: this.first,
          offset: this.offset
        };
      }
    }
  },
  computed: {
    headers() {
      return [
        {
          text: "Company",
          value: "name",
          align: "left",
          width: "30%",
          sortable: false
        },
        {
          text: "Query Titles",
          value: "additionalDataParsed.titles",
          class: "text-capitalize",
          align: "left",
          width: "60%",
          sortable: false
        },
        { text: '', value: 'data-table-expand' },
      ];
    },
    contactFinderResultsParsed() {
      if (!!this.contactFinderResults.inputCompaniesList){
        return this.contactFinderResults.inputCompaniesList.map(res => {
          let additionalDataParsed = JSON.parse(res.additionalData);
          additionalDataParsed.titles = additionalDataParsed.titles.split("|").join(", ");
          return {...res, additionalDataParsed: additionalDataParsed};
        });
      }
      return [];
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
