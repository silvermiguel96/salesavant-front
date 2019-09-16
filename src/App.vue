<template>
  <v-app>
    <template>
      <v-content>
        <main-menu
          v-if="isAuthenticated"
          :showSearch="showSearch"
          @toggleSearch="toggleSearch"
          :showJobsQueue="showJobsQueue"
          @toggleJobsQueuve="toggleJobsQueuve"
        ></main-menu>
        <full-screen-search
          v-if="isAuthenticated"
          :show="showSearch"
          @toggle="toggleSearch"
          :expand="expand"
        ></full-screen-search>
        <jobs-queue
          v-if="isAuthenticated && !!showJobsQueue"
          :show="showJobsQueue"
          @toggle="toggleJobsQueuve"
        ></jobs-queue>
        <router-view :showSearch="showSearch" @toggleSearch="toggleSearch"></router-view>
      </v-content>
    </template>
  </v-app>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import FullScreenSearch from "./components/fullscreensearch/FullScreenSearch.vue";
import JobsQueue from "./components/jobsqueue/JobsQueue.vue";
import { json } from "body-parser";
import { AUTH_TOKEN } from './vue-apollo';

export default {
  name: "App",
  components: {
    MainMenu,
    FullScreenSearch,
    JobsQueue
  },
  data() {
    return {
      isAuthenticated: false,
      showSearch: false,
      showJobsQueue: false,
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
      this.showSearch = data.show;
      this.expand = data.expand || 0 ;
    },
    toggleJobsQueuve(data) {
      this.showJobsQueue = data.show;
    }
  }
};
</script>
