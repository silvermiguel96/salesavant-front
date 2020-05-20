<template>
  <v-container fluid class="p-2">
    <v-row>
      <v-col cols="12" md="6" class="px-0 py-0 pb-1 pr-sm-3 pb-sm-0">
        <v-card outlined style="height:100%;" class="pa-3">
          <v-card-title>
            <div class="title text-secondary">Account</div>
          </v-card-title>
          <div class="d-flex flex-row justify-space-between my-6">
            <v-card-text>
              <v-text-field
                v-model="fullname"
                autocomplete="off"
                label="Name"
                type="text"
                name="name"
                disabled
                dense
                filled
                outlined
              ></v-text-field>
              <v-text-field
                v-model="myUser.email"
                autocomplete="off"
                label="Email"
                type="email"
                name="email"
                disabled
                filled
                dense
                outlined
              ></v-text-field>
            </v-card-text>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="px-0 py-0">
        <v-card outlined style="height:100%;" class="pa-3">
          <v-card-title>
            <div class="title text-secondary">Connections</div>
          </v-card-title>
          <div class="d-flex flex-row justify-space-between my-6">
            <v-row no-gutters>
              <v-col cols="8">
                <v-card-text>
                  <v-row class="d-md-block" no-gutters>
                    <v-col cols="12" xs="6">
                      <div class="subtitle-2 font-weight-medium text-capitalize">Salesforce</div>
                    </v-col>
                    <v-col cols="12" xs="6" v-for="oauth in myUser.oauths" :key="oauth.serviceUrl">
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
              <v-col cols="4">
                <v-card-text>
                  <v-row class="d-md-block" no-gutters>
                    <v-col cols="12" xs="6">
                      <div v-if="!myUser.oauths.length">
                        <v-btn color="primary" to="/oauth/salesforce">Connect</v-btn>
                      </div>
                      <div v-else>
                        <v-btn color="primary" to="/oauth/salesforce" disabled>Connect</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
          </div>
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
  computed: {
    fullname() {
      return `${this.myUser.firstName} ${this.myUser.lastName}`;
    }
  }
};
</script>