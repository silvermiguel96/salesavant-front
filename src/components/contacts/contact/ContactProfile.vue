<template>
  <v-card style="height:100%;">
    <v-card-subtitle>
      <div class="headline font-weight-bold">{{ contact.fullName }} <small><a v-if="contact.linkedinHandle"
          :href="`https://linkedin.com${contact.linkedinHandle}`"
          target="_blank"
        >LinkedIn</a></small> </div>
      <div class="caption">Last update : {{ contact.modificationTime | moment("MMMM Do YYYY") }}</div>
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
              <span class="font-weight-light">{{ contact.personalEmail || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Personal email:</span>
                <span class="font-weight-light">{{ contact.personalEmail || "--" }}</span>
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
              <div class="subtitle-2 font-weight-medium">Capital Efficiency Score</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span class="font-weight-light">{{ contact.capitalEfficiencyScoreAverage || "--" }}</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Capital Efficiency Score</span>
                <span class="font-weight-light float-right">{{ contact.capitalEfficiencyScoreAverage || "--" }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-text>
          <v-row class="d-none d-md-block" no-gutters>
            <v-col cols="12" xs="6">
              <div class="subtitle-2 font-weight-medium">Wolfpack Score</div>
            </v-col>
            <v-col cols="12" xs="6">
              <span
                v-if="contact.wolfpackScore"
                class="font-weight-light"
              >{{ contact.wolfpackScore || "--" }}</span>
              <span v-else>--</span>
            </v-col>
          </v-row>
          <v-row class="d-block d-md-none" no-gutters>
            <v-col xs="12">
              <div>
                <span class="subtitle-2 font-weight-medium">Wolfpack Score</span>
                <span class="font-weight-light float-right">
                  <span
                    v-if="contact.wolfpackScore"
                    class="font-weight-light"
                  >{{ contact.wolfpackScore || "--" }}</span>
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
                <span class="font-weight-light float-right">{{ contact.scaleScoreAverage || "--" }}</span>
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
import gql from "graphql-tag";

export default {
  data() {
    return {
      contact: []
    };
  },
  apollo: {
    contact: {
      query: gql`
        query contact($uid: String) {
          contact(uid: $uid) {
            uid
            creationTime
            modificationTime
            fullName
            personalEmail
            personalPhone
            bio
            linkedinHandle
            additionalData
            scaleScoreAverage
            capitalEfficiencyScoreAverage
            wolfpackScore
            numberOfExits
            companies {
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
  }
};
</script>

<style scoped>
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
</style>
