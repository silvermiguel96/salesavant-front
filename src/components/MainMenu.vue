<template>
  <v-toolbar color="primary" dark app dense>
    <router-link to="/">
      <img class="logo" :src="require('../assets/salesavant_header.png')">
    </router-link>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat to="/playlists">Playlists</v-btn>
      <v-btn flat to="/search">Search</v-btn>
      <v-btn flat to="/search-with-signals">Search with Signals</v-btn>
    </v-toolbar-items>
    <v-toolbar-side-icon></v-toolbar-side-icon>
  </v-toolbar>
</template>

<script>
export default {
  data: () => {}
};
</script>

<style lang="scss" scoped>
.logo {
  width: 150px;
}
</style>
