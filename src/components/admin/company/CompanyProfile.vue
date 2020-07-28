<template>
  <v-card v-if="company" style="height:100%;" class="pa-3">
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="Website Admin" color="primary" v-model="company.url"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="Momentum Admin" color="primary" v-model="company.momentum"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="Vertical Groups" color="primary" v-model="company.vertical"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="Industry" color="primary" v-model="company.industry"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="Country" color="primary" v-model="company.country"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="State" color="primary" v-model="company.state"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="City" color="primary" v-model="company.city"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="Employees" color="primary" v-model="company.numEmployees"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="Scale Score" color="primary" v-model="company.scaleScore"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field
              dense
              label="Capital Efficiency Score"
              color="primary"
              v-model="company.capitalEfficiencyScore"
            ></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field
              dense
              label="Acquirer Name"
              color="primary"
              v-model="company.acquirerName"
            ></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="Date Founded" color="primary" v-model="company.dateFounded"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="Exit Date" color="primary" v-model="company.exitDate"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="Exit Value" color="primary" v-model="company.exitValue"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-md-block" no-gutters>
            <v-text-field dense label="Status" color="primary" v-model="company.status"></v-text-field>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card-text>
          <v-row no-gutters>
            <v-textarea v-model="company.description" label="Description"></v-textarea>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
    <v-row no-gutters class="d-flex justify-end">
      <v-col cols="12" md="6">
        <v-row class="d-flex" no-gutters>
          <v-col cols="12" md="6" class="px-1">
            <v-btn block class="text-capitalize" dark color="red lighten-1">
              <v-icon small>delete</v-icon>Delete
            </v-btn>
          </v-col>
          <v-col cols="12" md="6" class="px-1">
            <v-btn block class="text-capitalize" color="primary">
              <v-icon small>save</v-icon>Save
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import LongParagraph from "../../common/LongParagraph.vue";

import gql from "graphql-tag";
export default {
  data() {
    return {
      company: null,
    };
  },
  components: {
    LongParagraph,
  },
  apollo: {
    company: {
      query: gql`
        query getSingleCompany($uid: String) {
          company(uid: $uid) {
            uid
            name
            momentum
            vertical
            description
            url
            city
            state
            country
            numEmployees
            status
            totalScore
            totalSignals
            industry
            naicsCode
            modificationTime
            scaleScore
            capitalEfficiencyScore
            dateFounded
            acquirerName
            exitDate
            exitValue
            naics {
              search
              description
              code
            }
          }
        }
      `,
      variables() {
        return {
          uid: this.$route.params.companiesUid,
        };
      },
      fetchPolicy: "cache-and-network",
    },
  },
  computed: {
    httpCompany: function () {
      return this.company.url.startsWith("http")
        ? this.company.url
        : `http://${this.company.url}`;
    },
  },
};
</script>

<style scoped>
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
</style>
