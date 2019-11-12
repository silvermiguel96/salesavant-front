<template>
  <v-app>
    <template>
      <v-content>
        <main-menu
          v-if="isAuthenticated"
          :showSearch="showSearch"
          @toggleSearch="toggleSearch"
        ></main-menu>
        <full-screen-search
          v-if="isAuthenticated"
          :show="showSearch"
          @toggleSearch="toggleSearch"
          :expand="expand"
        ></full-screen-search>
        <router-view :showSearch="showSearch" @toggleSearch="toggleSearch"></router-view>
      </v-content>
    </template>
  </v-app>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import FullScreenSearch from "./components/fullscreensearch/FullScreenSearch.vue";
import { json } from "body-parser";
import { AUTH_TOKEN } from './vue-apollo';

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
    }
  }
};
</script>
