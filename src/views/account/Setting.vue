<template>
  <v-container grid-list-xs>
    <v-stepper v-model="steperConfig">
      <v-stepper-header>
        <v-stepper-step :complete="steperConfig > 1" step="1">Connect</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="steperConfig > 2" step="2">Setup</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3">Sync</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-8" height="150px" outlined>
            <div class="d-flex flex-row justify-space-center my-1">
              <v-row no-gutters>
                <v-col cols="12" class>
                  <v-card-text class="mt-4">
                    <v-row class="d-md-block" no-gutters>
                      <v-col cols="12" xs="6" class="d-flex justify-center">
                        <div v-if="!myUser.oauths.length">
                          <v-btn color="primary" to="/oauth/salesforce">Connect</v-btn>
                        </div>
                        <div v-else>
                          <v-btn
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
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-8" height="150px" outlined>
            <v-checkbox
              color="primary"
              v-model="checkbox"
              label="Accept terms and conditions of the data to be supplied"
            ></v-checkbox>
          </v-card>
          <div class="d-flex justify-end">
            <v-btn v-if="checkbox" @click="changeStepper" color="primary">Next</v-btn>
            <v-btn v-else color="primary" disabled>Next</v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card
            v-if="!startSync"
            height="150px"
            class="d-flex align-center justify-center"
            outlined
          >
            <v-card-actions class="d-flex justify-center">
              <v-btn color="primary" @click="tostartSync">Start Sync</v-btn>
            </v-card-actions>
          </v-card>
          <v-card
            v-else
            class="mb-4 d-flex flex-column align-center justify-center"
            height="200px"
            outlined
          >
            <v-card-text class="text-center" v-if="value === 100">Done!</v-card-text>
            <v-progress-circular 
              v-else
              :rotate="360"
              :size="80"
              :width="15"
              :value="value"
              color="light-blue"
            >{{ value }}%</v-progress-circular>
            <v-card-text class="text-center">Processing Information</v-card-text>
              <router-link color="primary" to="/account">Back to Profile</router-link>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      myUser: {
        oauths: {}
      },
      checkbox: false,
      indeterminate: false,
      interval: {},
      startSync: false,
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
  methods: {
    ...mapMutations(["updateStep"]),
    changeStepper() {
      this.updateStep(3);
    },
    tostartSync() {
      this.startSync = true;
      this.interval = setInterval(() => {
        if (this.value === 99) {
          // return (this.value = 0);
          clearInterval(this.interval);
        }
        this.value += 1;
      }, 1000);
    }
  },
  computed: {
    fullname() {
      return `${this.myUser.firstName} ${this.myUser.lastName}`;
    },
    steperConfig() {
      return this.$store.state.steperConfig;
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  mounted() {}
};
</script>