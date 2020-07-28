<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="3" md="3" lg="2" class="pa-1">
        <add-user />
      </v-col>
      <v-row no-gutters class="d-flex justify-end">
        <v-col cols="12" sm="6" md="6" lg="6" class="pa-1">
          <v-text-field
            v-model="search"
            append-icon="filter_list"
            label="Quick Search"
            hide-details
            placeholder="Type a Name or Email"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-row>
    <!-- Result -->
    <div v-if="accounts" class="result">
      <user-table
        v-if="this.accounts"
        :items="this.accounts[0].users"
        :totalResults="this.accounts[0].users.length"
        @updateOptions="updateOptions"
        @deletePlaylist="deletePlaylist"
      ></user-table>
    </div>
    <div v-else class="no-result">Loading...</div>
  </v-container>
</template>
<script>
import gql from "graphql-tag";
import { setTimeout } from "timers";
import UserTable from "./UsersTable.vue";
import AddUser from "./AddUser.vue";

export default {
  data() {
    return {
      items: [],
      totalResults: 0,
      page: 1,
      itemsPerPage: 10,
      search: "",
    };
  },
  methods: {
    updateOptions({ dataFromEvent: { page = 1, itemsPerPage = 10 } }) {
      this.page = page;
      this.itemsPerPage = itemsPerPage;
    },
    deletePlaylist() {},
  },
  components: {
    UserTable,
    AddUser,
  },
  apollo: {
    accounts: {
      query: gql`
        query {
          accounts {
            users {
              id
              lastName
              firstName
              email
              status
            }
          }
        }
      `,
    },
  },
};
</script>