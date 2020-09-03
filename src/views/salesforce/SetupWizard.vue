<template>
  <v-container fluid>
    <v-stepper v-model="salesforceWizardStep">
      <v-stepper-header>
        <v-stepper-step :complete="salesforceWizardStep > 1" step="1">Connect</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="salesforceWizardStep > 2" step="2">Setup</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Sync</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-8" height="220px" outlined>
            <div class="d-flex flex-row justify-space-center my-1">
              <v-row no-gutters>
                <v-col cols="12" class>
                  <v-card-text class="mt-4">
                    <v-row class="d-md-block" no-gutters>
                      <v-col cols="12" xs="6" class="d-flex justify-center">
                        <v-btn color="primary" to="/oauth/salesforce">Authorize</v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-8" height="220px" outlined>
            <v-form ref="formStep2" class="ma-4 mt-8">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-select
                    v-model="periodicity"
                    :items="periodicityIntervals"
                    label="Syncronization Periodicity"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12">
                  <v-checkbox
                    color="primary"
                    v-model="checkbox"
                    label="Accept terms and conditions for the data supplied"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
          <div class="d-flex justify-end">
            <v-btn color="default" @click="cancelWizard" class="mx-2">Cancel</v-btn>
            <v-btn
              color="primary"
              :disabled="!checkbox"
              @click="setupConnection"
              class="ml-2"
            >Continue</v-btn>
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card
            v-if="!syncRunning"
            height="150px"
            class="d-flex align-center justify-center"
            outlined
          >
            <v-card-actions class="d-flex justify-center">
              <v-btn color="primary" @click="startDownload">Get Salesforce data</v-btn>
            </v-card-actions>
          </v-card>
          <v-card
            v-else
            class="mb-4 d-flex flex-column align-center justify-center"
            height="200px"
            outlined
          >
            <v-card-text class="title text-center green--text" v-if="progress === 100">Done!</v-card-text>
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
            <v-btn color="primary" @click="finishWizard" :disabled="progress<100">View Results</v-btn>
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
      periodicity: "None",
      periodicityIntervals: ["None", "Daily", "Weekly", "Monthly"],
      checkbox: false,
      interval: null,
      syncRunning: false,
      progress: 0,
      jobDescription: "",
    };
  },
  props: {
    salesavantAPI: { type: String, default: process.env.VUE_APP_REST_API_URL },
  },
  methods: {
    ...mapMutations([
      "updateSalesforceWizardConf",
      "resetSalesforceWizardConf",
    ]),
    setupConnection() {
      if (!this.$refs.formStep2.validate()) {
        return;
      }
      const that = this;
      const { salesforceCode } = this;
      fetch(this.salesavantAPI + "/oauth/salesforce?jwt=" + getAuthToken(), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salesforceCode,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          if (data.status == "ok") {
            that.setupScheduledJob(data.salesforceConnectionId);
            that.updateSalesforceWizardConf({
              step: 3,
              connectionId: data.salesforceConnectionId,
            });
          } else {
            that.updateSalesforceWizardConf({
              step: 1,
            });
            that.$eventBus.$emit(
              "showSnack",
              "Error while setup connection to Salesforce",
              "error"
            );
          }
        })
        .catch(function (error) {
          console.log("Error:" + error.message);
          that.updateSalesforceWizardConf({
            step: 1,
          });
        });
    },
    async setupScheduledJob(salesforceConnectionId) {
      if (this.periodicity !== "None") {
        this.$eventBus.$emit("createScheduledJob", {
          jobType: "salesforce_download_nodb",
          periodicity: this.periodicity,
          additionalData: {
            salesforce_connection_id: salesforceConnectionId,
          },
        });
        this.$eventBus.$emit("createScheduledJob", {
          jobType: "salesforce_upload_nodb",
          periodicity: this.periodicity,
          additionalData: {
            salesforce_connection_id: salesforceConnectionId,
          },
        });
      }
    },
    async startDownload() {
      this.syncRunning = true;
      this.$eventBus.$emit("createJob", {
        jobType: "salesforce_download",
        additionalData: {
          salesforce_connection_id: this.salesforceWizardConnectionId,
        },
        onSuccess: (salesavantJob) => {
          this.monitorJobProgress(salesavantJob.uid);
        },
      });
    },
    monitorJobProgress(jobUid) {
      let that = this;
      this.interval = setInterval(() => {
        this.$apollo
          .query({
            query: gql`
              query getJob($jobUid: String!) {
                salesavantJob(uid: $jobUid) {
                  uid
                  description
                  progress
                  status
                }
              }
            `,
            variables: {
              jobUid: jobUid,
            },
            fetchPolicy: "no-cache",
          })
          .then((resp) => {
            if (!!resp.data && !!resp.data.salesavantJob) {
              this.progress = resp.data.salesavantJob.progress;
              this.jobDescription = resp.data.salesavantJob.description;
              if (resp.data.salesavantJob.status == "finished") {
                clearInterval(this.interval);
                setTimeout(function () {}, 2000);
              }
            }
          });
      }, 2000);
    },
    finishWizard() {
      this.$router.push("/salesforce", () => {
        this.resetSalesforceWizardConf();
      });
    },
    cancelWizard() {
      this.salesforceAccountName = "";
      this.syncInterval = null;
      this.checkbox = false;
      this.resetSalesforceWizardConf();
    },
  },
  computed: {
    salesforceWizardStep() {
      return this.$store.state.salesforceWizard.step;
    },
    salesforceCode() {
      return this.$store.state.salesforceWizard.salesforceCode;
    },
    salesforceWizardConnectionId() {
      return this.$store.state.salesforceWizard.connectionId;
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>