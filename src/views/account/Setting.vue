<template>
  <v-container grid-list-xs>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1">Connect</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2">Set Up</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">Sync Up</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-12" height="200px" outlined>
            <div class="d-flex flex-row justify-space-between my-1">
              <v-row no-gutters>
                <v-col cols="8">
                  <v-card-text class="pr-0">
                    <v-row class="d-md-block" no-gutters>
                      <v-col cols="12" xs="6">
                        <div class="subtitle-2 font-weight-medium text-capitalize">Salesforce</div>
                      </v-col>
                      <v-col
                        cols="12"
                        xs="6"
                        v-for="oauth in myUser.oauths"
                        :key="oauth.serviceUrl"
                      >
                        <a
                          v-if="myUser.oauths"
                          :key="`news-external-link${ myUser.oauths[0].serviceUrl || ''}`"
                          :href="myUser.oauths[0].serviceUrl"
                          target="_blank"
                        >{{ myUser.oauths[0].serviceUrl || "--"}}</a>
                        <span class="font-weight-light">{{ }}</span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
                <v-col cols="4" class>
                  <v-card-text class="mt-4">
                    <v-row class="d-md-block" no-gutters>
                      <v-col cols="12" xs="6" class="d-flex justify-center">
                        <div v-if="!myUser.oauths.length">
                          <v-btn
                            small
                            color="primary"
                            to="/oauth/salesforce"
                            target="_blank"
                          >Connect</v-btn>
                        </div>
                        <div v-else>
                          <v-btn
                            small
                            color="primary"
                            to="/oauth/salesforce"
                            target="_blank"
                            disabled
                          >Connect</v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </div>
          </v-card>

          <v-btn color="primary" @click="e1 = 2">Continue</v-btn>

          <v-btn text>Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-12" height="200px" outlined>
            <v-checkbox
              color="primary"
              v-model="checkbox"
              label="Accept terms and conditions of the data to be supplied"
            ></v-checkbox>
          </v-card>

          <v-btn color="primary" @click="e1 = 3" v-if="checkbox">Continue</v-btn>
          <v-btn color="primary" v-else disabled>Continue</v-btn>

          <v-btn text>Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card class="mb-12" height="200px" outlined>
            <div class="text-center ma-12">
              <v-progress-circular
                :rotate="360"
                :size="60"
                :width="15"
                :value="value"
                color="light-blue"
              >{{ value }}%</v-progress-circular>
            </div>
            <div>
              <p>upload data</p>
            </div>
          </v-card>

          <v-btn color="primary" @click="e1 = 1">Continue</v-btn>

          <v-btn text>Cancel</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      e1: 1,
      myUser: {
        oauths: {}
      },
      checkbox: false,
      indeterminate: false,
      interval: {},
      value: 0
    };
  },
  apollo: {
    myUser: {
      query: gql`
        query {
          myUser {
            firstName
            lastName
            email
            status
            oauths {
              serviceName
              serviceUrl
            }
          }
        }
      `,
      fetchPolicy: "cache-and-network"
    }
  },
  computed: {
    fullname() {
      return `${this.myUser.firstName} ${this.myUser.lastName}`;
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {
    this.interval = setInterval(() => {
      if (this.value === 99) {
        // return (this.value = 0);
        clearInterval(this.interval);
      }
      this.value += 1;
    }, 1000);
  },
};
</script>