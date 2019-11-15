<template>
  <nav>
    <v-navigation-drawer left small app v-model="drawer" class="primary">
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
    <v-toolbar color="primary" dark dense>
      <v-app-bar-nav-icon class="d-md-none" small @click="drawer = !drawer"></v-app-bar-nav-icon>
      <router-link to="/home">
        <img class="logo mt-1" :src="require('../assets/salesavant_header.png')" />
      </router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down " v-for="link in links" :key="link.text">
        <v-btn v-if="!!link.click" text class="text-capitalize" @click="link.click">{{link.text}}</v-btn>
        <v-btn v-else text class="text-capitalize" :to="link.router">{{link.text}}</v-btn>
      </v-toolbar-items>
      <v-toolbar-items>
        <v-btn text color="white" class="text-capitalize px-0" style="min-width: 30px;"  @click="this.exitApp">
          <v-icon medium right>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
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
          text: "Contacts",
          router: "/contacts",
          click: this.onNews
        },
        { 
          icon: "work", 
          text: "Jobs", 
          click: this.onJobs
        },
        { 
          icon: "search", 
          text: "Search", 
          click: this.toggleSearch 
        }
      ]
    };
  },
  props: {
  },
  methods: {
    toggleSearch() {
      this.$emit("toggleSearch", {expand: 0});
    },
    onJobs() {
      this.$router.push("/jobs");
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
