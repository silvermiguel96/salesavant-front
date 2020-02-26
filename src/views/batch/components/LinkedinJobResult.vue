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
          :items-per-page="options.itemsPerPage"
          :server-items-length="linkedinFinderResults.totalResults"
          :options.sync="options"
          item-key="id"
          hide-default-footer
        >
          <template v-slot:default="props">
            <div v-for="item in props.items" :key="item.id">
              <v-card class="pa-3">
                <v-row  no-gutters >
                  <v-col cols="12" md="6">
                    <div><span class="subtitle-2 font-weight-medium">Name: </span> {{ item.fullName }}</div>
                    <div>
                      <span class="subtitle-2 font-weight-medium">LinkedIn: </span>
                      <a :href="`https://linkedin.com/in/${item.linkedinHandle}`" target="_blank">
                        {{ item.linkedinHandle }}
                      </a>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div><span class="subtitle-2 font-weight-medium">Title: </span>{{ item.title || "--" }}</div>
                    <div><span class="subtitle-2 font-weight-medium">Company: </span> {{ item.company || "--" }}</div>
                  </v-col>
                </v-row>
              </v-card>
              <v-simple-table v-if="item.candidates">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left" style="width:15%;">Name</th>
                      <th class="text-left" style="width:25%;">Title/Company</th>
                      <th class="text-left">LinkedIn</th>
                      <th class="text-left">Score</th>
                      <th class="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="candidate in item.candidates" :key="candidate.id">
                      <td>{{ candidate.fullName }}</td>
                      <td>
                        <div>{{ candidate.title || "--" }}</div>
                        <div>{{ candidate.company || "--" }}</div>
                      </td>
                      <td><a :href="`https://linkedin.com/in/${candidate.linkedinHandle}`" target="_blank">{{ candidate.linkedinHandle }}</a></td>
                      <td>{{ candidate.score || "--" }}</td>
                      <td>Select</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <div v-else>
                Not results found
              </div>
            </div>
          </template>
          <template v-slot:footer>
            <v-row class="mt-2" align="center" justify="center">
              <v-spacer></v-spacer>
              <span
                class="mr-4
                grey--text"
              >
                Record {{ options.page }} of {{ linkedinFinderResults.totalResults }}
              </span>
              <v-btn
                fab
                dark
                small
                color="blue darken-3"
                class="mr-1"
                @click="formerPage"
              >
                <v-icon>chevron-left</v-icon>
              </v-btn>
              <v-btn
                fab
                dark
                small
                color="blue darken-3"
                class="ml-1"
                @click="nextPage"
              >
                <v-icon>chevron-right</v-icon>
              </v-btn>
            </v-row>
          </template>
        </v-data-iterator>
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
        itemsPerPage: 1
      },
    };
  },
  props: {
    salesavantAPI: { type: String, default: process.env.VUE_APP_REST_API_URL },
    job: Object
  },
  methods: {
    nextPage () {
      if (this.options.page + 1 <= this.linkedinFinderResults.totalResults) this.options.page += 1
    },
    formerPage () {
      if (this.options.page - 1 >= 1) this.options.page -= 1
    }
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
          first: this.options.itemsPerPage,
          offset: this.options.itemsPerPage * this.options.page - this.options.itemsPerPage
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
