<template>
  <v-container fluid class="p-2">
    <v-row>
      <v-col cols="12" class="px-2 py-0 pr-sm-2 pb-sm-0">
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
              salesforceUrl
            }
            oauths{
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
  },
  computed: {
    fullname() {
      return `${this.myUser.firstName} ${this.myUser.lastName}`;
    }
  }
};
</script>