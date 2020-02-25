<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="1000" @keydown.esc="dialog=false">
    <template v-slot:activator="{ on }">
      <a v-on="on" href="#">View</a>
    </template>
    <v-card>
      <v-card-title style="padding-left:16px;">LinkedIn Finder Results</v-card-title>
      <v-card-subtitle>{{ additionalDataParsed.original_filename }}</v-card-subtitle>
      <v-divider class="mx-4"></v-divider>
      <v-card-text>
        <v-data-table
          v-if="!!job"
          :headers="headers"
          :items="linkedinFinderResultsParsed"
          :server-items-length="linkedinFinderResults.totalResults"
          :options.sync="options"
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
              <div class="ma-3" v-for="candidate in item.candidates" :key="candidate.id">
                <v-row  no-gutters>
                  <v-col cols="4">
                    <div><span class="subtitle-2 font-weight-medium">Name: </span> {{ candidate.fullName }}</div>
                    <div>
                      <span class="subtitle-2 font-weight-medium">LinkedIn: </span> <a :href="`https://linkedin.com/in/${candidate.linkedinHandle}`" target="_blank">{{ candidate.linkedinHandle }}</a>
                    </div>
                    <div><span class="subtitle-2 font-weight-medium">Score: </span> {{ candidate.score }}</div>
                  </v-col>
                  <v-col cols="6">
                    <div><span class="subtitle-2 font-weight-medium">Title: </span>{{ candidate.title || "--" }}</div>
                    <div><span class="subtitle-2 font-weight-medium">Company: </span> {{ candidate.company || "--" }}</div>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </div>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions class="mx-4">
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog=false">Close</v-btn>
        <a
          :href="`${salesavantAPI}/files/download/${additionalDataParsed.storage_output_filename}`"
          target="_blank"
        >Download</a>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import gql from "graphql-tag";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      dialog: false,
      linkedinFinderResults: [],
      expanded: [],
      options: {
        page: 1,
        itemsPerPage: 5
      },
    };
  },
  props: {
    salesavantAPI: { type: String, default: process.env.VUE_APP_REST_API_URL },
    job: Object
  },
  methods: {
  },
  apollo: {
    linkedinFinderResults: {
      query: gql`
        query linkedinFinderResults($jobUid: String, $first: Int, $offset: Int) {
          linkedinFinderResults(
            jobUid: $jobUid
            first: $first
            offset: $offset
          ) {
            totalResults
            inputPersonsList {
              id
              fullName
              title
              company
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
          first: this.options.itemsPerPage,
          offset: this.options.itemsPerPage * this.options.page - this.options.itemsPerPage
        };
      }
    }
  },
  computed: {
    headers() {
      return [
        {
          text: "Name",
          value: "fullName",
          align: "left",
          width: "30%",
          sortable: false
        },
        {
          text: "Company",
          value: "company",
          align: "left",
          width: "30%",
          sortable: false
        },
        {
          text: "Title",
          value: "title",
          align: "left",
          width: "30%",
          sortable: false
        },
        { text: '', value: 'data-table-expand' },
      ];
    },
    linkedinFinderResultsParsed() {
      if (!!this.linkedinFinderResults.inputPersonsList){
        return this.linkedinFinderResults.inputPersonsList.map(res => {
          let additionalDataParsed = JSON.parse(res.additionalData);
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
