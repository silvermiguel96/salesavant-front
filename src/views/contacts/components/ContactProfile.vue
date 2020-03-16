<template>
  <v-card style="height:100%;">
    <v-card-subtitle>
      <div class="headline">{{ contact.fullName }}</div>
      <div class="caption">Last update : {{ callMethodTime(contact.modificationTime) }}</div>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Personal email</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light">{{ contact.personalEmail || "[empty name]" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Personal email:</span>
                <span class="font-weight-light">{{ contact.personalEmail || "[empty name]" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Personal Number</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span
                v-if="contact.personalPhone"
                class="font-weight-light"
              >{{ contact.personalPhone || "[empty name]" }}</span>
              <span v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Personal Number:</span>
                <span class="font-weight-light float-right">
                  <span
                    v-if="contact.personalPhone"
                    class="font-weight-light"
                  >{{ contact.personalPhone || "[empty name]" }}</span>
                  <span v-else>--</span>
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Biography</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light">{{ contact.bio || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Biography:</span>
                <span class="font-weight-light float-right">{{ contact.bio || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Additional Data</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light">{{ contact.additionalData || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Additional Data:</span>
                <span class="font-weight-light float-right">{{ contact.additionalData || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Linkedin</div>
            </v-col>
            <v-col cols="12" xs="6">
              <a
                v-if="contact.linkedinHandle"
                :href="`https://linkedin.com/in/${contact.linkedinHandle}`"
                target="_blank"
              >{{ contact.linkedinHandle }}</a>
              <span v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Linkedin:</span>
                <a
                  v-if="contact.linkedinHandle"
                  :href="`https://linkedin.com/in/${contact.linkedinHandle}`"
                  target="_blank"
                >{{ contact.linkedinHandle }}</a>
                <span v-else>--</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Capital Efficiency Score Average</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light">{{ contact.capitalEfficiencyScoreAverage || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Capital Efficiency Score Average:</span>
                <span class="font-weight-light">{{ contact.capitalEfficiencyScoreAverage || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Capital Efficiency Estimate Average</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span
                v-if="contact.capitalEfficiencyEstimateAverage"
                class="font-weight-light"
              >{{ contact.capitalEfficiencyEstimateAverage || "--" }}</span>
              <span v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Capital Efficiency Estimate Average:</span>
                <span class="font-weight-light float-right">
                  <span
                    v-if="contact.capitalEfficiencyEstimateAverage"
                    class="font-weight-light"
                  >{{ contact.capitalEfficiencyEstimateAverage || "--" }}</span>
                  <span v-else>--</span>
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>

        <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Scale Score Average</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light">{{ contact.scaleScoreAverage || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Scale Score Average:</span>
                <span class="font-weight-light">{{ contact.scaleScoreAverage || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Number Of Exits</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span
                v-if="contact.numberOfExits"
                class="font-weight-light"
              >{{ contact.numberOfExits || "--" }}</span>
              <span v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Number Of Exits:</span>
                <span class="font-weight-light float-right">
                  <span
                    v-if="contact.numberOfExits"
                    class="font-weight-light"
                  >{{ contact.numberOfExits || "--" }}</span>
                  <span v-else>--</span>
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { formatDateTime } from "../../../commons";
import gql from "graphql-tag";

export default {
  data() {
    return {
      contact: []
    };
  },
  methods: {
    callMethodTime(time) {
      return formatDateTime(time);
    }
  },
  apollo: {
    contact: {
      query: gql`
        query contactOne($uid: String) {
          contact(uid: $uid) {
            creationTime
            modificationTime
            uid
            fullName
            personalEmail
            personalPhone
            bio
            linkedinHandle
            additionalData
            scaleScoreAverage
            capitalEfficiencyScoreAverage
            capitalEfficiencyEstimateAverage
            numberOfExits
            companies {
              searchContactCompanies
              title
              businessEmail
              businessPhone
              bioUrl
              bio
              isCurrent
            }
          }
        }
      `,
      variables() {
        return {
          uid: this.$route.params.contactUid
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  beforeCreate() {
    this.$apollo.queries.contact;
  }
};
</script>

<style scoped>
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
</style>
