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
              <v-list-item-title class="white--text" :to="link.router">{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/account" @click="onAccount">
            <v-list-item-icon>
              <v-icon class="white--text">account_circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text" to="/account">My perfil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/home" @click="exitApp">
            <v-list-item-icon>
              <v-icon class="white--text">exit_to_app</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text" to="/home">Login out</v-list-item-title>
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
      <v-toolbar-items class="hidden-sm-and-down" v-for="link in links" :key="link.text">
        <v-btn v-if="!!link.click" text class="text-capitalize" @click="link.click">{{link.text}}</v-btn>
        <v-btn v-else text class="text-capitalize" :to="link.router">{{link.text}}</v-btn>
      </v-toolbar-items>
      <v-menu left bottom offset-y>
        <template class="hidden-sm-and-down" v-slot:activator="{ on }">
          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn text class="text-capitalize" v-on="on">Account</v-btn>
          </v-toolbar-items>
        </template>
        <v-list class="pa-0">
          <v-list-item v-for="account in accounts" :key="account.text" @click="account.click">
            <v-list-item-title class="subtitle-1 font-weight-medium">{{ account.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
        }
      ],
      accounts: [
        {
          text: "Profile",
          router: "/account",
          click: this.onAccount
        },
        {
          text: "Logout",
          router: "/home",
          click: this.exitApp
        },
      ]
    };
  },
  props: {},
  methods: {
    ...mapMutations(["resetCompanySearch", "resetContactSearch"]),
    onBatch() {
      this.resetSearch();
      this.$router.push("/batch").catch(err => {});
    },
    onPlaylists() {
      this.resetSearch();
      this.$router.push("/playlists").catch(err => {});
    },
    onCompanies() {
      this.resetSearch();
      this.$router.push("/companies").catch(err => {});
    },
    onContacts() {
      this.resetSearch();
      this.$router.push("/contacts").catch(err => {});
    },
    onSignals() {
      this.resetSearch();
      this.$router.push("/signals").catch(err => {});
    },
    onAccount() {
      this.resetSearch();
      this.$router.push("/account").catch(err => {});
    },
    exitApp() {
      localStorage.removeItem(AUTH_TOKEN);
      this.$router.go("/login");
    },
    resetSearch() {
      this.resetCompanySearch();
      this.resetContactSearch();
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 170px;
}
</style>
