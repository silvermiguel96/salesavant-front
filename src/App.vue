<template>
  <v-app>
    <v-content>
      <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
        {{ snackText }}
        <v-btn text @click="snack = false">Close</v-btn>
      </v-snackbar>
      <main-menu v-if="isAuthenticated" :showSearch="showSearch" @toggleSearch="toggleSearch"></main-menu>
      <advanced-search
        v-if="isAuthenticated"
        v-model="showSearchDialog"
        :expand="expand"
        @toggleSearch="toggleSearch"
        @showSearch="showSearch"
        @hideSearch="hideSearch"
      ></advanced-search>
      <router-view
      :showSearch="showSearchDialog"
      @toggleSearch="toggleSearch"
      @showSnack="showSnack"
      @hideSnack="hideSnack"
      @createJob="createJob"></router-view>
    </v-content>
  </v-app>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import AdvancedSearch from "./components/advanced-search/AdvancedSearch";
import { json } from "body-parser";
import { AUTH_TOKEN } from './vue-apollo';
import gql from "graphql-tag";
import _get from "lodash.get";

export default {
  name: "App",
  components: {
    MainMenu,
    AdvancedSearch
  },
  data() {
    return {
      isAuthenticated: false,
      showSearchDialog: false,
      expand: 0,
      snack: false,
      snackColor: "",
      snackText: "",
    };
  },
  created() {
    if (!!localStorage.getItem(AUTH_TOKEN)) {
      this.isAuthenticated = true;
      console.log('AUTH_TOKEN', AUTH_TOKEN);
    }
  },
  methods: {
    toggleSearch(data) {
      this.showSearchDialog = !this.showSearchDialog;
      this.expand = data.expand || 0 ;
    },
    showSearch(){
      this.showSearchDialog = true;
    },
    hideSearch(){
      this.showSearchDialog = false;
    },
    showSnack(text, color){
      this.snack = true;
      this.snackText = text;
      this.snackColor = color;
    },
    hideSnack(){
      this.snack = false;
      this.snackText = '';
      this.snackColor = '';
    },
    async createJob(jobData){
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($jobType: String!, $description: String, $additionalData: JSONString) {
            createJob(
              jobType: $jobType
              description: $description
              additionalData: $additionalData
            ) {
              salesavantJob {
                uid
                creationTime
                jobType
                description
                additionalData
              }
            }
          }
        `,
        variables: {
          jobType: _get(jobData, "jobType"),
          description: _get(jobData, "description", ""),
          additionalData: jobData.additionalData ? JSON.stringify(jobData.additionalData): ""
        }
      });
    }
  }
};
</script>
