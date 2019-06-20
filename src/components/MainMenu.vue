<template>
  <v-toolbar color="primary" dark app dense>
    <router-link to="/home">
      <img class="logo" :src="require('../assets/salesavant_header.png')">
    </router-link>
    <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down" v-for="link in links" :key="link.text">
        <v-btn flat :to="link.router">{{link.text}}</v-btn>
      </v-toolbar-items>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
  </v-toolbar>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      links: [
        { icon: "find_replace", text: "Playlists", router: "/playlists" },
        { icon: "assessment", text: "Companies", router: "/companies" },
        { icon: "search", text: "Search", router: "/search" },
        {
          icon: "search",
          text: "Search with Signals",
          router: "/search-with-signals"
        },
        { icon: "assessment", text: "New Companies", router: "/new-companies" }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 150px;
}
</style>
