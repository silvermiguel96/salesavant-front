<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="px-2 py-0 pr-sm-2 pb-24">
        <v-card class="pb-2">
          <v-card-title>
            <v-row no-gutters>
              <v-col cols="12" md="9"></v-col>
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
                  <div class="title text-secondary">Salesforce</div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="8">
                  <a
                    :href="sfConnection.salesforceUrl"
                    target="_blank"
                  >{{ sfConnection.salesforceUrl || "--"}}</a>
                </v-col>
                <v-col cols="2">
                  <router-link to="salesforce-objects">View Data</router-link>
                </v-col>
                <v-col cols="2" class="d-flex justify-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="red"
                        v-bind="attrs"
                        v-on="on"
                        @click="deleteSalesforceConnection(sfConnection.id)"
                      >power_off</v-icon>
                    </template>
                    <span>Disconnect from Salesforce</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <div>
                <v-row>
                  <v-col cols="12" md="6" class="d-flex justify-center">
                    <v-btn color="cyan darken-2" @click="downloadSalesforceData(sfConnection.id)" block dark>
                      <v-icon class="mr-2">cloud_download</v-icon>Get Data
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6" class="d-flex justify-center">
                    <v-btn color="cyan darken-2" @click="uploadSalesforceData(sfConnection.id)" block dark>
                      <v-icon class="mr-2">cloud_upload</v-icon>Upload Data
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
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
                deleteSalesforceConnection(salesforceConnectionId: $salesforceConnectionId) {
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
        additionalData: {}
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
        additionalData: { salesforceConnectionId }
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