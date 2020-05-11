<template>
  <v-container fluid>
    <v-card class="d-flex flex-column align-center mx-auto py-4" max-width="400" outlined>
      <div class="title text-secondary">Account</div>
      <div class="d-flex flex-row justify-space-between my-6">
        <v-card-text>
          <v-text-field
            v-model="fullname"
            autocomplete="off"
            label="Name"
            type="text"
            name="name"
            append-icon="account_circle"
            disabled
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            autocomplete="off"
            label="Email"
            type="email"
            name="email"
            append-icon="mail"
            disabled
          ></v-text-field>
        </v-card-text>
      </div>
      <v-btn color="primary" to="/oauth/salesforce">Connect to Salesforce</v-btn>
    </v-card>
  </v-container>
</template>
<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      user: {
        name: "",
        email: ""
      }
    };
  },
  apollo: {
    user: {
      query: gql`
        query user{
          user(id: 1) {
            id
            firstName
            lastName
            email
          }
        }
      `,
      fetchPolicy: "cache-and-network"
    }
  },
  computed: {
    fullname() {
      return `${this.user.firstName} ${this.user.lastName}`
    }
  }
};
</script>