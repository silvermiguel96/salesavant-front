<template>
  <v-app>
    <main-menu></main-menu>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";

export default {
  name: "App",
  components: {
    MainMenu
  },
  data() {
    return {
      //
    };
  }
};
</script>
