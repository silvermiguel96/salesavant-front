<template>
  <v-toolbar color="primary" dark app dense>
    <img class="logo" :src="require('../assets/salesavant_header.png')">
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat>Playlists</v-btn>
      <v-btn flat>Search</v-btn>
      <v-btn flat>Search with Signals</v-btn>
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
  width: 11%;
}
</style>
