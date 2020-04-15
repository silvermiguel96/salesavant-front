<template>
  <v-dialog v-model="dialog" persistent max-width="1000" @keydown.esc="dialog=false">
    <template v-slot:activator="{ on }">
      <a v-on="on" href="#">View</a>
    </template>
    <v-card>
      <v-card-title style="padding-left:16px;">LinkedIn Finder Results</v-card-title>
      <v-card-subtitle>{{ additionalDataParsed.original_filename }}</v-card-subtitle>
      <v-divider class="mx-4"></v-divider>
      <v-card-text>
        <v-data-iterator
          v-if="!!job"
          :items="linkedinFinderResultsParsed"
          :server-items-length="linkedinFinderResults.totalResults"
          :options.sync="options"
          :footer-props="{
            'items-per-page-options': [1]
          }"
          item-key="id"
        >
          <template v-slot:default="props">
            <div v-for="item in props.items" :key="item.id">
              <v-card>
                <v-card-text class="pa-2">
                  <div class="title">Input Data</div>
                  <v-row  no-gutters >
                    <v-col cols="12" md="6">
                      <div><span class="subtitle-2 font-weight-medium">Name: </span> {{ item.fullName }}</div>
                      <div>
                        <span class="subtitle-2 font-weight-medium">LinkedIn: </span>
                        <a :href="`https://linkedin.com${item.linkedinHandle}`" target="_blank">
                          {{ item.linkedinHandle }}
                        </a>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div><span class="subtitle-2 font-weight-medium">Title: </span>{{ item.title || "--" }}</div>
                      <div><span class="subtitle-2 font-weight-medium">Company: </span> {{ item.company || "--" }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card :elevation="0">
                <v-card-text class="pa-2 mt-2">
                  <div class="title">Profile Candidates</div>
                  <v-simple-table v-if="item.candidates" dense style="max-height:40vh; overflow-y:scroll;" id="results-table">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left" style="width:30%;">Name/LinkedIn</th>
                          <th class="text-left" style="width:50%;">Title/Company</th>
                          <th class="text-left" style="width:10%;">Score</th>
                          <th class="text-left" style="width:10%; position: sticky; top: 0;">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="candidate in item.candidates" :key="candidate.id">
                          <td>
                            <div>
                              {{ candidate.fullName }}
                            </div>
                            <div>
                              <a :href="`https://linkedin.com${candidate.linkedinHandle}`" target="_blank">{{ candidate.linkedinHandle }}</a>
                            </div>
                          </td>
                          <td>
                            <div>{{ candidate.title || "--" }}</div>
                            <div>{{ candidate.company || "--" }}</div>
                          </td>
                          <td>{{ candidate.score || "--" }}</td>
                          <td>Select</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
              <div v-else>
                Not results found
              </div>
                </v-card-text>
              </v-card>
            </div>
          </template>
        </v-data-iterator>
      </v-card-text>
      <v-card-actions class="mx-4">
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog=false">Close</v-btn>
        <a v-if="additionalDataParsed.storage_output_filename"
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
        itemsPerPage:1,
        page: 1
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
              linkedinHandle
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
          first: 1,
          offset: this.options.page - 1
        };
      }
    }
  },
  computed: {
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