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
      mockAccount: {
        username: "1",
        password: "1"
      },
      showSearch: false,
      showJobsQueue: false,
      expand: "companies"
    };
  },
  async created() {
    try {
      await this.$auth.renewTokens();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    login() {
      this.$auth.login();
    },
    logout() {
      this.$auth.logOut();
    },
    handleLoginEvent(data) {
      console.log({ data });
      console.log("this.$auth.isAuthenticated()", this.$auth.isAuthenticated());
      if (this.$auth.isAuthenticated()) {
        this.isAuthenticated = this.$auth.isAuthenticated();
      } else {
        this.isAuthenticated = false;
      }
      this.profile = data.profile;
    },
    toggleSearch(data) {
      this.showSearch = data.show;
      this.expand = data.expand || "companies";
    },
    toggleJobsQueuve(data) {
      this.showJobsQueue = data.show;
    }
  }
};
</script>
