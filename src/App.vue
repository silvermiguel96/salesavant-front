<template>
  <v-app>
    <template>
      <v-content>
        <main-menu v-if="isAuthenticated"></main-menu>
        <router-view></router-view>
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
      isAuthenticated: false,
      mockAccount: {
        username: "1",
        password: "1"
      }
    };
  },
  async created() {
    try {
      await this.$auth.renewTokens();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    login() {
      this.$auth.login();
    },
    logout() {
      this.$auth.logOut();
    },
    handleLoginEvent(data) {
      console.log({ data });
      this.isAuthenticated = !!data.loggedIn;
      this.profile = data.profile;
    }
  }
};
</script>
