<template>
  <v-toolbar color="primary" dark app dense>
    <router-link to="/home">
      <img class="logo" :src="require('../assets/salesavant_header.png')" />
    </router-link>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down" v-for="link in links" :key="link.text">
      <v-btn v-if="!!link.click" flat @click="link.click">{{link.text}}</v-btn>
      <v-btn v-else flat :to="link.router">{{link.text}}</v-btn>
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
        { icon: "search", text: "Search", click: this.toggleSearch },
        { icon: "assessment", text: "New Companies", router: "/new-companies" }
      ]
    };
  },
  props: {
    showSearch: { type: Boolean, default: false }
  },
  methods: {
    toggleSearch() {
      this.$emit("toggleSearch", { show: !this.$props.showSearch });
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 150px;
}
</style>
