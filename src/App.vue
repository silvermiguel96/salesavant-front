<template>
  <v-app>
    <template>
      <v-content>
        <main-menu v-if="isAuthenticated" :showSearch="showSearch" @toggleSearch="toggleSearch"></main-menu>
        <full-screen-search
          v-if="isAuthenticated"
          :showSearch="showSearch"
          :expand="expand"
          @toggleSearch="toggleSearch"
        ></full-screen-search>
        <router-view :showSearch="showSearch" @toggleSearch="toggleSearch" @createJob="createJob"></router-view>
      </v-content>
    </template>
  </v-app>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import FullScreenSearch from "./components/fullscreensearch/FullScreenSearch.vue";
import { json } from "body-parser";
import { AUTH_TOKEN } from './vue-apollo';
import gql from "graphql-tag";
import _get from "lodash.get";

export default {
  name: "App",
  components: {
    MainMenu,
    FullScreenSearch
  },
  data() {
    return {
      isAuthenticated: false,
      showSearch: false,
      expand: 0
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
      this.showSearch = !this.showSearch;
      this.expand = data.expand || 0 ;
    },
    async createJob(jobData){
      console.log("createJob", jobData);
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
          description: _get(jobData, "description"),
          additionalData: jobData.additionalData ? JSON.stringify(jobData.additionalData): ""
        }
      });
    }
  }
};
</script>
