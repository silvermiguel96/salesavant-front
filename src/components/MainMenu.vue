<template>
  <nav>
    <v-toolbar color="primary" dark dense>
      <router-link to="/home">
        <img class="logo" :src="require('../assets/salesavant_header.png')" />
      </router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down " v-for="link in links" :key="link.text">
        <v-btn v-if="!!link.click" text class="text-capitalize" @click="link.click">{{link.text}}</v-btn>
        <v-btn v-else text class="text-capitalize" :to="link.router">{{link.text}}</v-btn>
      </v-toolbar-items>
      <v-toolbar-items>
        <v-btn text color="white" class="text-capitalize" @click="this.exitApp">
          <span>Sign Out</span>
          <v-icon small right>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-app-bar-nav-icon small @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-toolbar>
    <v-navigation-drawer right small app v-model="drawer" class="primary">
      <v-list>
        <v-list-item-group>
          <v-list-item v-for="link in links" :key="link.text" :to="link.route" @click="link.click">
            <v-list-item-icon>
              <v-icon class="white--text">{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text " :to="link.router">{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>
<script>
import { AUTH_TOKEN } from "../vue-apollo";

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
        {
          icon: "business",
          text: "Companies",
          router: "/companies",
          click: this.onCompanies
        },
        {
          icon: "assessment",
          text: "News",
          router: "/news",
          click: this.onNews
        },
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
        expand: 0
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
      this.$router.push("/news");
    },
    exitApp() {
      localStorage.removeItem(AUTH_TOKEN);
      this.$router.go("/login");
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 150px;
}
</style>
