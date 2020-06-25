<template>
  <v-container fluid class="p-2">
    <v-row>
      <v-col cols="12" md="6" class="px-2 py-0 pr-sm-2 pb-sm-0">
        <v-card outlined style="height:100%;" class="pa-3">
          <v-card-title>
            <div class="title text-secondary">Account</div>
          </v-card-title>
          <div class="d-flex flex-row justify-space-between my-6">
            <v-card-text>
              <v-text-field
                v-model="myUser.email"
                autocomplete="off"
                label="Email"
                type="email"
                name="email"
                disabled
                dense
                outlined
              ></v-text-field>
              <v-text-field
                v-model="fullname"
                autocomplete="off"
                label="Name"
                type="text"
                name="name"
                dense
                outlined
              ></v-text-field>
            </v-card-text>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="px-2 py-1 py-sm-2 py-md-0">
        <v-card outlined style="height:100%;" class="pa-3">
          <v-card-title>
            <div class="title text-secondary">Connections</div>
          </v-card-title>
          <v-card outlined>
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="12">
                  <div class="title text-secondary">Salesforce</div>
                </v-col>
              </v-row>
              <v-row v-if="salesforceOauth">
                <v-col cols="10">
                  <a
                    :href="salesforceOauth.serviceUrl"
                    target="_blank"
                  >{{ salesforceOauth.serviceUrl || "--"}}</a>
                </v-col>
                <v-col cols="2" class="d-flex justify-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="red"
                        v-bind="attrs"
                        v-on="on"
                        @click="disconnectSalesforce"
                      >power_off</v-icon>
                    </template>
                    <span>Disconnect from Salesforce</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="12" md="12">
                  <v-btn block color="primary" to="/salesforce">Connect</v-btn>
                <v-col cols="12" sm="5">
                  <v-card-text>
                    <v-row>
                      <v-col cols="6" v-if="!myUser.oauths.length">
                        <v-btn small color="primary" to="/salesforce">Connect</v-btn>
                      </v-col>
                      <v-col cols="6" v-else>
                        <v-btn small color="primary" disabled>Connect</v-btn>
                      </v-col>
                      <v-col cols="2">
                        <v-icon>autorenew</v-icon>
                      </v-col>
                      <v-col cols="2">
                        <v-icon color="red" @click="disconnectSalesforce">power_off</v-icon>
                      </v-col>
                      <v-col cols="2">
                        <v-icon color="primary"  @click="toSalesforceObjects">visibility</v-icon>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
              <div v-if="salesforceOauth">
                <v-row>
                  <v-col cols="12" md="6" class="d-flex justify-center">
                    <v-btn color="cyan darken-2" block dark>
                      <v-icon class="mr-2">cloud_download</v-icon>Get Data
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6" class="d-flex justify-center">
                    <v-btn color="cyan darken-2" block dark>
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
        oauths: {}
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
    async disconnectSalesforce() {
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
              mutation($serviceName: String!) {
                deleteOauth(serviceName: $serviceName) {
                  status
                  message
                }
              }
            `,
            variables: {
              serviceName: "salesforce"
            }
          })
          .then(resp => {
            if (resp.data.deleteOauth.status == "ok") {
              this.myUser.oauths={};
              this.$eventBus.$emit(
                "showSnack",
                "Salesforce connection removed succesfully",
                "success"
              );
            } else {
              this.$eventBus.$emit(
                "showSnack",
                resp.data.deleteOauth.message,
                "error"
              );
            }
          });
      }
    },
    toSalesforceObjects() {
      this.$router.push('salesforceObjects')
    }
  },
  computed: {
    fullname() {
      return `${this.myUser.firstName} ${this.myUser.lastName}`;
    },
    salesforceOauth() {
      if (this.myUser.oauths.length > 0) {
        return this.myUser.oauths.find(
          oauth => oauth.serviceName.toLowerCase() === "salesforce"
        );
      }
      return undefined;
    }
  }
};
</script>