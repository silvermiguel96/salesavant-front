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
            <div class="d-flex flex-row justify-space-between my-1">
              <v-row no-gutters>
                <v-col cols="12" sm="7">
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
                <v-col cols="12" sm="5">
                  <v-card-text>
                    <v-row>
                      <v-col cols="6" v-if="!myUser.oauths.length" d>
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
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </div>
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
            Confirm you want to disconnect to  salesforce ?
        </h1> `,
        {
          buttonTrueText: "delete",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "primary",
          icon: "power_off",
          title: "Disconnect Salesforce",
          width: 600
        }
      );
      if (res) {
        console.log("confirm disconnect ");
      }
    }
  },
  computed: {
    fullname() {
      return `${this.myUser.firstName} ${this.myUser.lastName}`;
    }
  }
};
</script>