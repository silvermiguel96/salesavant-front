<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6" class="px-2 py-0 pr-sm-2 pb-sm-0">
        <v-card outlined style="height:100%;" class="pa-3">
          <v-card-title>
            <div class="title text-secondary">Profile</div>
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
              <v-text-field
                v-model="myUser.status"
                autocomplete="off"
                label="Status"
                type="status"
                name="status"
                disabled
                dense
                outlined
              ></v-text-field>
            </v-card-text>
          </div>
        </v-card>
      </v-col>
      <v-col cols="6" class="px-2 py-0 pr-sm-2 pb-sm-0">
        <v-card outlined style="height:100%;" class="pa-3">
          <v-card-title>
            <div class="title text-secondary">New Password</div>
          </v-card-title>
          <div class="d-flex flex-row justify-space-between my-6">
            <v-card-text>
              <v-text-field
                v-model="myUser.password"
                autocomplete="off"
                label="Password"
                type="Password"
                name="Password"
                dense
                outlined
              ></v-text-field>
              <v-text-field
                v-model="myUser.password"
                autocomplete="off"
                label="New Password"
                type="Password"
                name="Password"
                dense
                outlined
              ></v-text-field>
              <v-text-field
                v-model="myUser.password"
                autocomplete="off"
                label="Confirm new Password"
                type="Password"
                name="Password"
                dense
                outlined
              ></v-text-field>
              <v-btn color="primary" block disabled>Change Password</v-btn>
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
        oauths: [],
        password: "",
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
            oauths {
              serviceName
              serviceUrl
            }
          }
        }
      `,
      fetchPolicy: "cache-and-network",
    },
  },
  methods: {},
  computed: {
    fullname() {
      return `${this.myUser.firstName} ${this.myUser.lastName}`;
    },
  },
};
</script>