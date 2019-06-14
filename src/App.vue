<template>
  <v-app>
    <template v-if="$route.meta.public === true">
      <transition>
        <keep-alive>
          <router-view :key="$route.fullpath"></router-view>
        </keep-alive>
      </transition>
    </template>
    <template v-else-if="$route.name">
      <v-content>
        <main-menu ></main-menu>
        <router-view @authenticated="setAuthenticated"></router-view>
      </v-content>
    </template>
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
      authenticated: false,
      mockAccount: {
        username: "1",
        password: "1"
      }
    };
  },
  mounted() {
    if (!this.authenticated) {
      this.$router.replace({ name: "login" });
    }
  },
  methods: {
    setAuthenticated(status) {
      this.authenticated = status;
    },
    logout() {
      this.authenticated = false;
    }
  }
};
</script>
