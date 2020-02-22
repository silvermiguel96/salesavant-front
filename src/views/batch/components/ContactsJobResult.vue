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
          show-expand
          :headers="headers"
          :items="contactFinderResultsParsed"
          :footer-props="{
            'items-per-page-options': [10, 20, 50]
          }"
          item-key="fullname"
          expanded.sync="expanded"
        >
          <template v-slot:expanded-item="{ headers,item }">
            <td :colspan="headers.length">
              <v-row v-for="person in item.candidates" :key="person.fullname" class="ma-0 pa-0">
                <v-col cols="1"></v-col>
                <v-col cols="4" class="mt-1 pa-0 pl-3">
                  <p class="ma-0 pa-0">{{ person.fullname }}</p>
                  <a :href="person.linkedin_handle" target="_black">Linkedin</a>
                </v-col>
                <v-col cols="6" class="ma-0 pa-0">
                  <p></p>
                  <p>{{ person.company }}</p>
                </v-col>
                <v-col cols="1">
                  <v-icon v-if="person.score > 70" color="success">check</v-icon>
                </v-col>
              </v-row>
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
                fullName
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
          text: "Titles",
          value: "additionalDataParsed.titles",
          align: "left",
          width: "60%",
          sortable: false
        }
      ];
    },
    contactFinderResultsParsed() {
      if (!!this.contactFinderResults.inputCompaniesList){
        return this.contactFinderResults.inputCompaniesList.map(res => {
          return {...res, additionalDataParsed: JSON.parse(res.additionalData)};
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
