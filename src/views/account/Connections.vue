<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="px-2 py-0 pr-sm-2 pb-24">
        <v-card class="pb-2">
          <v-card-title>
            <v-row no-gutters>
              <v-col cols="12" md="9" class="title text--secondary">Connections</v-col>
              <v-col cols="12" md="3" class="md-offset-9">
                <v-btn block color="primary" to="/salesforce-setup">
                  <v-icon size="20">add</v-icon>Setup Connection
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card
            v-for="sfConnection in myUser.sfConnections"
            :key="sfConnection.id"
            class="ma-md-4"
            outlined
          >
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="12">
                  <div class="body-1 text-secondary">Salesforce</div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="10">
                  <a
                    :href="sfConnection.salesforceUrl"
                    target="_blank"
                  >{{ sfConnection.salesforceUrl || "--"}}</a>
                </v-col>
                <v-col cols="2" class="d-flex justify-end">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="red"
                        v-bind="attrs"
                        v-on="on"
                        @click="deleteSalesforceConnection(sfConnection.id)"
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
                            <span>Download </span><router-link class="caption" to="salesforce-objects">view data</router-link>
                          </div>
                          <div class="text--secondary pb-2">
                            <span class="caption" v-if="sfConnection.downloadLastRun">Last run: {{ sfConnection.downloadLastRun | moment("MMMM Do YYYY, H:mm") }}</span>
                          </div>
                          <v-btn
                            color="cyan darken-2"
                            @click="downloadSalesforceData(sfConnection.id)"
                            dark
                            small
                          >
                            <v-icon class="mr-2">cloud_download</v-icon>Get Data
                          </v-btn>
                        </v-col>
                        <v-col cols="6" class="d-flex justify-end">
                          <div class="d-flex flex-column align-center justify-space-around">
                            <h1>{{ sfConnection.downloadedRecords || "-" }}</h1>
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
                            <span class="caption" v-if="sfConnection.uploadLastRun">Last run: {{ sfConnection.uploadLastRun | moment("MMMM Do YYYY, H:mm") }}</span>
                          </div>
                          <v-btn
                            color="cyan darken-2"
                            @click="uploadSalesforceData(sfConnection.id)"
                            dark
                            small
                          >
                            <v-icon class="mr-2">cloud_upload</v-icon>Upload Data
                          </v-btn>
                        </v-col>
                        <v-col cols="6" class="d-flex justify-end">
                          <div class="d-flex flex-column align-center justify-space-around">
                            <h1>{{ sfConnection.uploadedRecords || "-" }}</h1>
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
          </v-card>
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
      myUser: {
        sfConnections: [],
        oauths: []
      }
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
            sfConnections {
              id
              salesforceUrl
              downloadLastRun
              downloadedRecords
              uploadLastRun
              uploadedRecords
            }
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
    async deleteSalesforceConnection(salesforceConnectionId) {
      const res = await this.$confirm(
        `<h1 class="subtitle-1">
            Are you sure do you want to disconnect from Salesforce?
        </h1> `,
        {
          buttonTrueText: "disconnect",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "primary",
          icon: "power_off",
          title: "Confirm Disconnect from Salesforce",
          width: 600
        }
      );
      if (res) {
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
              salesforceConnectionId: salesforceConnectionId
            }
          })
          .then(resp => {
            if (resp.data.deleteSalesforceConnection.status == "ok") {
              let sfConnection = this.myUser.sfConnections.find(
                sfConnection => sfConnection.id === salesforceConnectionId
              );
              this.myUser.sfConnections = this.myUser.sfConnections.filter(
                sfConnection => sfConnection.id !== salesforceConnectionId
              );
              this.$eventBus.$emit(
                "showSnack",
                `Salesforce connection to ${sfConnection.salesforceUrl} removed succesfully`,
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
          salesforce_connection_id: salesforceConnectionId
        }
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
          salesforce_connection_id: salesforceConnectionId
        }
      });
      this.$eventBus.$emit(
        "showSnack",
        `Job Salesforce Upload enqueed successfully`,
        "success"
      );
    }
  },
  computed: {}
};
</script>