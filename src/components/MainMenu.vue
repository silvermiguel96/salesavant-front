<template>
  <nav>
    <v-navigation-drawer left small app v-model="drawer" color="primary">
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
        <v-btn text color="white" class="text-capitalize" @click="this.exitApp">
            Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </nav>
</template>
<script>
import { AUTH_TOKEN } from "../util";
import { mapMutations } from "vuex";

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
          click: this.onContacts
        },
        {
          icon: "gps_fixed",
          text: "Signals",
          router: "/signals",
          click: this.onSignals
        },
        { 
          icon: "work", 
          text: "Batch",
          click: this.onBatch
        },
        { 
          icon: "search", 
          text: "Search", 
          click: this.showSearch 
        }
      ]
    };
  },
  props: {
  },
  methods: {
    ...mapMutations([
      'resetAdvancedSearch'
    ]),
    showSearch() {
      return this.$store.commit('showSearchDialog');
    },
    onBatch() {
      this.resetAdvancedSearch();
      this.$router.push("/batch").catch(err => {});
    },
    onPlaylists() {
      this.resetAdvancedSearch();
      this.$router.push("/playlists").catch(err => {});
    },
    onCompanies() {
      this.resetAdvancedSearch();
      this.$router.push("/companies").catch(err => {});
    },
    onContacts() {
      this.resetAdvancedSearch();
      this.$router.push("/contacts").catch(err => {});
    },
    onSignals() {
      this.resetAdvancedSearch();
      this.$router.push("/signals").catch(err => {});
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
  width: 170px;
}
</style>
