<template>
  <v-dialog v-model="dialog" scrollable persistent max-width="1000" @keydown.esc="dialog=false">
    <template v-slot:activator="{ on }">
      <a v-on="on" href="#">View</a>
    </template>
    <v-card>
      <v-card-title style="padding-left:16px;">Contacts</v-card-title>
      <v-card-subtitle>{{ additionalDataParsed.playlist_name }}</v-card-subtitle>
      <v-divider class="mx-4"></v-divider>
      <v-card-text>
        <v-data-table
          v-if="!!job"
          show-expand
          :headers="headers"
          :items="constacts"
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
      expanded: [],
      singleExpand: true,
      dialog: false
    };
  },
  props: {
    job: Object
  },
  methods: {
    _get: _get,
  },
  computed: {
    headers() {
      return [
        {
          text: "Full name",
          value: "fullname",
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
        {
          text: "Company",
          value: "company",
          align: "left",
          width: "30%",
          sortable: false
        }
      ];
    },
    constacts() {
      return [
        {
          fullname: " Roberto Centeno",
          title: "Mr. Cooper",
          company: "Mortgage Professional Ii",
          candidates: [
            {
              fullname: " Roberto Centeno",
              title: "Mr. Cooper",
              company: "Mortgage Professional Ii",
              linkedin_handle:
                "https://linkedin.com/in/roberto-centeno-77aba2101",
              score: "52"
            },
            {
              fullname: "Joel Hopkins",
              title: "Lit Mortgage",
              company: "Residential Mortgage Loan Advisor",
              linkedin_handle: "https://linkedin.com/in/joel-hopkins-89436933",
              score: "67"
            },
            {
              fullname: "Shaundra Ramer",
              title: "Midwest Region",
              company:
                "Senior Loan Consultant-Nmls 954749 - New American Funding",
              linkedin_handle:
                "https://linkedin.com/in/shaundra-ramer-58117361",
              score: "80"
            },
            {
              fullname: "Tyler Burns",
              title: "Altius Mortgage Group",
              company: "Mortgage Consultant",
              linkedin_handle: "https://linkedin.com/in/tyler-burns-92844052",
              score: "78"
            },
            {
              fullname: "Chris Morrow",
              title: "Delmar Financial Company",
              company: "Senior Loan Consultant",
              linkedin_handle: "https://linkedin.com/in/chris-morrow-38449052",
              score: "70"
            }
          ]
        },
        {
          fullname: "Joel Hopkins",
          title: "Lit Mortgage",
          company: "Residential Mortgage Loan Advisor",
          candidates: [
            {
              fullname: " Roberto Centeno",
              title: "Mr. Cooper",
              company: "Mortgage Professional Ii",
              linkedin_handle:
                "https://linkedin.com/in/roberto-centeno-77aba2101",
              score: "52"
            },
            {
              fullname: "Joel Hopkins",
              title: "Lit Mortgage",
              company: "Residential Mortgage Loan Advisor",
              linkedin_handle: "https://linkedin.com/in/joel-hopkins-89436933",
              score: "67"
            },
            {
              fullname: "Shaundra Ramer",
              title: "Midwest Region",
              company:
                "Senior Loan Consultant-Nmls 954749 - New American Funding",
              linkedin_handle:
                "https://linkedin.com/in/shaundra-ramer-58117361",
              score: "80"
            },
            {
              fullname: "Tyler Burns",
              title: "Altius Mortgage Group",
              company: "Mortgage Consultant",
              linkedin_handle: "https://linkedin.com/in/tyler-burns-92844052",
              score: "78"
            },
            {
              fullname: "Chris Morrow",
              title: "Delmar Financial Company",
              company: "Senior Loan Consultant",
              linkedin_handle: "https://linkedin.com/in/chris-morrow-38449052",
              score: "70"
            }
          ]
        },
        {
          fullname: "Shaundra Ramer",
          title: "Midwest Region",
          company: "Senior Loan Consultant-Nmls 954749 - New American Funding",
          candidates: [
            {
              fullname: " Roberto Centeno",
              title: "Mr. Cooper",
              company: "Mortgage Professional Ii",
              linkedin_handle:
                "https://linkedin.com/in/roberto-centeno-77aba2101",
              score: "52"
            },
            {
              fullname: "Joel Hopkins",
              title: "Lit Mortgage",
              company: "Residential Mortgage Loan Advisor",
              linkedin_handle: "https://linkedin.com/in/joel-hopkins-89436933",
              score: "67"
            },
            {
              fullname: "Shaundra Ramer",
              title: "Midwest Region",
              company:
                "Senior Loan Consultant-Nmls 954749 - New American Funding",
              linkedin_handle:
                "https://linkedin.com/in/shaundra-ramer-58117361",
              score: "80"
            },
            {
              fullname: "Tyler Burns",
              title: "Altius Mortgage Group",
              company: "Mortgage Consultant",
              linkedin_handle: "https://linkedin.com/in/tyler-burns-92844052",
              score: "78"
            },
            {
              fullname: "Chris Morrow",
              title: "Delmar Financial Company",
              company: "Senior Loan Consultant",
              linkedin_handle: "https://linkedin.com/in/chris-morrow-38449052",
              score: "70"
            }
          ]
        },
        {
          fullname: "Tyler Burns",
          title: "Altius Mortgage Group",
          company: "Mortgage Consultant"
        },
        {
          fullname: "Chris Morrow",
          title: "Delmar Financial Company",
          company: "Senior Loan Consultant"
        }
      ];
    },
    additionalDataParsed: function() {
      if (!!this.job && !!this.job.additionalData) {
        return JSON.parse(this.job.additionalData);
      }
    }
  }
};
</script>
