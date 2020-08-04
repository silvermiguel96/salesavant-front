<template>
  <v-card v-if="company" style="height:100%;" class="pa-3">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-text-field
            dense
            :rules="websiteRules"
            label="Website Admin"
            color="primary"
            v-model="company.url"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="Momentum Admin" color="primary" v-model="company.momentum"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="Status" color="primary" v-model="company.status"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            dense
            label="Name"
            :rules="nameRules"
            color="primary"
            required
            v-model="company.name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="Vertical Groups" color="primary" v-model="company.vertical"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="Industry" color="primary" v-model="company.industry"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="Country" color="primary" v-model="company.country"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="State" color="primary" v-model="company.state"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="City" color="primary" v-model="company.city"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="Employees" color="primary" v-model="company.numEmployees"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="Scale Score" color="primary" v-model="company.scaleScore"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            dense
            label="Capital Efficiency Score"
            color="primary"
            v-model="company.capitalEfficiencyScore"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="Acquirer Name" color="primary" v-model="company.acquirerName"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="Date Founded" color="primary" v-model="company.dateFounded"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="Exit Date" color="primary" v-model="company.exitDate"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field dense label="Exit Value" color="primary" v-model="company.exitValue"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea class="pa-0 ma-0" v-model="company.description" label="Description"></v-textarea>
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
              <v-btn
                block
                class="text-capitalize"
                :disabled="!valid"
                @click="validate"
                color="primary"
              >
                <v-icon small>save</v-icon>Save
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import LongParagraph from "../../common/LongParagraph.vue";

import gql from "graphql-tag";
export default {
  data() {
    return {
      company: null,
      valid: true,
      websiteRules: [
        (v) => !!v || "Url is required",
        (v) =>
          /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(
            v
          ) || "Url is not valid",
      ],
      nameRules: [(v) => !!v || "Name is required"],
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
  methods: {
    validate() {
      this.$refs.form.validate();
    },
  },
};
</script>

<style scoped>
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
.col-6 {
  padding: 0px 5px !important;
}
.col-12 {
  padding: 3px 6px !important;
}
</style>
