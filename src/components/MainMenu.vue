<template>
  <nav>
    <v-toolbar color="primary" dark dense>
      <router-link to="/home">
        <img class="logo" :src="require('../assets/salesavant_header.png')" />
      </router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down" v-for="link in links" :key="link.text">
        <v-btn v-if="!!link.click" flat @click="link.click">{{link.text}}</v-btn>
        <v-btn v-else flat :to="link.router">{{link.text}}</v-btn>
      </v-toolbar-items>
      <v-toolbar-items>
        <v-btn flat color="white" @click="this.exitApp">
          <span>Sign Out</span>
          <v-icon right >exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
    </v-toolbar>
    <v-navigation-drawer right app v-model="drawer" class="primary">
      <v-layout column align-center>
        <v-flex class="mt-4">
          <img class="text-lg-center" src="../../public/static/salesavant_header.png" />
        </v-flex>
      </v-layout>
      <v-list>
        <v-list-tile v-for="link in links" :key="link.text" :to="link.route" @click="link.click">
          <v-list-tile-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text" :to="link.router">{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>
<script>
import { AUTH_TOKEN } from '../vue-apollo';

export default {
  data() {
    return {
      drawer: false,
      links: [
        {
          icon: "playlist_play",
          text: "Playlists",
          router: "/playlists",
          click: this.onPlaylists
        },
        { icon: "business", text: "Companies", router: "/companies", click: this.onCompanies },
        { icon: "assessment", text: "News", router: "/news", click: this.onNews },
        { icon: "search", text: "Search", click: this.toggleSearch },
        { icon: "work", text: "Jobs Queue", click: this.toggleJobsQueuve }
      ]
    };
  },
  props: {
    showSearch: { type: Boolean, default: false },
    showJobsQueue: { type: Boolean, default: false }
  },
  methods: {
    toggleSearch() {
      this.$emit("toggleSearch", {
        show: !this.$props.showSearch,
        expand: "companies"
      });
    },
    toggleJobsQueuve() {
      this.$emit("toggleJobsQueuve", { show: !this.$props.showJobsQueue });
    },
    onPlaylists() {
      this.$router.push("/playlists");
    },
    onCompanies() {
      this.$router.push("/companies");
    },
    onNews() {
      this.$router.push("/news")
    },
    exitApp() {
      localStorage.removeItem(AUTH_TOKEN);
       this.$router.go("/login")
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 150px;
}
</style>
