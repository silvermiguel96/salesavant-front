<template>
  <v-container fluid>
    <v-stepper v-model="salesforceSetupStep">
      <v-stepper-header>
        <v-stepper-step :complete="salesforceSetupStep > 1" step="1">Connect</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="salesforceSetupStep > 2" step="2">Setup</v-stepper-step>
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
            <v-btn v-if="checkbox" @click="setSalesforceSetupStep(3)" color="primary">Next</v-btn>
            <v-btn v-else color="primary" disabled>Next</v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card v-if="!syncRunning"
            height="150px"
            class="d-flex align-center justify-center"
            outlined
          >
            <v-card-actions class="d-flex justify-center">
              <v-btn color="primary" @click="startSync">Start Sync</v-btn>
            </v-card-actions>
          </v-card>
          <v-card
            v-else
            class="mb-4 d-flex flex-column align-center justify-center"
            height="200px"
            outlined
          >
            <v-card-text class="text-center" v-if="progress === 100">Done!</v-card-text>
            <v-progress-circular 
              v-else
              :rotate="360"
              :size="80"
              :width="15"
              :value="progress.toFixed(0)"
              color="light-blue"
              style="font-size: 0.9em;"
            >{{ progress.toFixed(0) }}%</v-progress-circular>
            <v-card-text class="text-center">{{ jobDescription }}</v-card-text>
              <router-link color="primary" to="/account">Back to Profile</router-link>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import { getAuthToken } from "../../util";
import gql from "graphql-tag";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      myUser: {
        oauths: {}
      },
      checkbox: false,
      interval: null,
      syncRunning: false,
      progress: 0,
      jobDescription:""
    };
  },
  props: {
    salesavantAPI: { type: String, default: process.env.VUE_APP_REST_API_URL }
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
    ...mapMutations(["setSalesforceSetupStep"]),
    startSync() {
      this.syncRunning = true;
      let that = this;
      this.$apollo.mutate({
        mutation: gql`
          mutation($jobType: String!) {
            createJob(
              jobType: $jobType
            ) {
              salesavantJob {
                uid
                creationTime
                jobType
                description
                additionalData
              }
            }
          }
        `,
        variables: {
          jobType: "salesforce_sync",
        }
      }).then(resp => {
          if (!!resp.data && !!resp.data.createJob && !!resp.data.createJob.salesavantJob) {
            console.log(resp.data.createJob.salesavantJob);
            that.monitorJobProgress(resp.data.createJob.salesavantJob.uid);
          }
      });
    },
    monitorJobProgress(jobUid){
      this.interval = setInterval(() => {
        this.$apollo.query({
          query: gql`
            query getJob($jobUid: String!){
              salesavantJob(uid: $jobUid){
                uid
                description
                progress
                status
              }
            }
          `,
          variables: {
            jobUid: jobUid
          },
          fetchPolicy: "no-cache"
        })
        .then(resp => {
          if (!!resp.data && !!resp.data.salesavantJob) {
            this.progress = resp.data.salesavantJob.progress;
            this.jobDescription = resp.data.salesavantJob.description;
            if (resp.data.salesavantJob.description=="finished"){
              this.syncRunning = false;
              clearInterval(this.interval);
            }
          }
        });
      }, 2000);
    }
  },
  computed: {
    salesforceSetupStep() {
      return this.$store.state.salesforceSetupStep;
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>