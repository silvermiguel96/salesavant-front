<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="px-2 py-0 pr-sm-2 pb-24">
        <v-card class="pb-2">
          <v-card-title v-if="!salesforceConnection">
            <v-row no-gutters>
              <v-col cols="12" md="9" class="title text--secondary">Salesforce</v-col>
              <v-col cols="12" md="3" class="md-offset-9">
                <v-btn block color="primary" to="/salesforce-setup">
                  <v-icon size="20">add</v-icon>Setup Connection
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text v-else>
            <v-row no-gutters>
              <v-col md="10" cols="12">
                <div class="title text-secondary text-capitalize">Salesforce</div>
                <a :href="salesforceConnection.salesforceUrl" target="_blank">Go to Salesforce</a>
              </v-col>
              <v-col md="2" cols="12" class="d-flex justify-md-end align-start">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon size="22" v-bind="attrs" v-on="on" class="mx-md-2">settings</v-icon>
                  </template>
                  <span>Configure this connection</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="red lighten-2"
                      size="22"
                      v-bind="attrs"
                      v-on="on"
                      @click="deleteSalesforceConnection(salesforceConnection.id)"
                    >power_off</v-icon>
                  </template>
                  <span>Delete this connection</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-card outlined>
                  <v-card-text class="d-flex justify-space-between">
                    <v-row no-gutters>
                      <v-col cols="6" class="d-flex flex-column justify-space-between">
                        <div class="body-1 text--secondary">
                          <span>Download&nbsp;</span>
                          <router-link class="caption" to="/salesforce-objects">View data</router-link>
                        </div>
                        <div class="text--secondary pb-2">
                          <span class="caption">Last run:&nbsp;</span>
                          <span
                            class="caption"
                            v-if="salesforceConnection.downloadLastRun"
                          >{{ salesforceConnection.downloadLastRun | moment("MMMM Do YYYY, H:mm") }}</span>
                          <span v-else>--</span>
                        </div>
                        <v-btn
                          color="light-blue darken-1"
                          @click="downloadSalesforceData(salesforceConnection.id)"
                          small
                          dark
                        >
                          <v-icon class="mr-2">cloud_download</v-icon>Get Data
                        </v-btn>
                      </v-col>
                      <v-col cols="6" class="d-flex justify-end">
                        <div class="d-flex flex-column align-center justify-space-around">
                          <h1>{{ salesforceConnection.downloadedRecords || "--" }}</h1>
                          <div class="caption">Records Downloaded</div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card outlined>
                  <v-card-text class="d-flex justify-space-between">
                    <v-row no-gutters>
                      <v-col cols="6" class="d-flex flex-column justify-space-between">
                        <div class="body-1 text--secondary">
                          <span>Upload</span>
                        </div>
                        <div class="text--secondary pb-2">
                          <span class="caption">Last run:&nbsp;</span>
                          <span
                            class="caption"
                            v-if="salesforceConnection.uploadLastRun"
                          >{{ salesforceConnection.uploadLastRun | moment("MMMM Do YYYY, H:mm") }}</span>
                          <span v-else>--</span>
                        </div>
                        <v-btn
                          color="light-blue darken-1"
                          @click="uploadSalesforceData(salesforceConnection.id)"
                          small
                          dark
                        >
                          <v-icon class="mr-2">cloud_upload</v-icon>Upload Data
                        </v-btn>
                      </v-col>
                      <v-col cols="6" class="d-flex justify-end">
                        <div class="d-flex flex-column align-center justify-space-around">
                          <h1>{{ salesforceConnection.uploadedRecords || "--" }}</h1>
                          <div class="d-flex flex-column align-center">
                            <div class="caption">Records Uploaded</div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-dialog v-model="deleteDialog" persistent width="320">
            <v-card >
              <v-card-text class="pa-2 text-center">
                Deleting all synced data ... please wait
                <v-progress-linear indeterminate color="primary"></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      deleteDialog: false,
      myUser: {
        account: {
          salesforceConnection: undefined,
        },
      },
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
            account {
              salesforceConnection {
                id
                salesforceUrl
                downloadLastRun
                downloadedRecords
                uploadLastRun
                uploadedRecords
              }
            }
          }
        }
      `,
      fetchPolicy: "cache-and-network",
    },
  },
  methods: {
    async deleteSalesforceConnection(salesforceConnectionId) {
      const res = await this.$confirm(
        `<p class="subtitle-1 text-justify">
            Are you sure do you want to disconnect from Salesforce, all synced data is going to be deleted from Salesavant?
        </p> `,
        {
          buttonTrueText: "disconnect",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "light-blue darken-1",
          icon: "power_off",
          title: "Disconnect from Salesforce",
          width: 600,
        }
      );
      if (res) {
        this.deleteDialog = true;
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($salesforceConnectionId: Int!) {
                deleteSalesforceConnection(
                  salesforceConnectionId: $salesforceConnectionId
                ) {
                  status
                  message
                }
              }
            `,
            variables: {
              salesforceConnectionId: salesforceConnectionId,
            },
          })
          .then((resp) => {
            if (resp.data.deleteSalesforceConnection.status == "ok") {
              this.deleteDialog = false;
              this.myUser.account.salesforceConnection = undefined;
              this.$eventBus.$emit(
                "showSnack",
                `Salesforce connection removed succesfully`,
                "success"
              );
            } else {
              this.$eventBus.$emit(
                "showSnack",
                resp.data.deleteSalesforceConnection.message,
                "error"
              );
            }
          });
      }
    },
    downloadSalesforceData(salesforceConnectionId) {
      this.$eventBus.$emit("createJob", {
        jobType: "salesforce_download",
        additionalData: {
          salesforce_connection_id: salesforceConnectionId,
        },
      });
      this.$eventBus.$emit(
        "showSnack",
        `Job Salesforce Download enqueed successfully`,
        "success"
      );
    },
    uploadSalesforceData(salesforceConnectionId) {
      this.$eventBus.$emit("createJob", {
        jobType: "salesforce_upload",
        additionalData: {
          salesforce_connection_id: salesforceConnectionId,
        },
      });
      this.$eventBus.$emit(
        "showSnack",
        `Job Salesforce Upload enqueed successfully`,
        "success"
      );
    },
  },
  computed: {
    salesforceConnection() {
      return this.myUser.account.salesforceConnection;
    },
  },
};
</script>