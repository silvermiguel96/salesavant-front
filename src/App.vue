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
      console.log("this.$auth.isAuthenticated()", this.$auth.isAuthenticated());
      if (this.$auth.isAuthenticated()) {
        this.$router.push("/home");
        this.isAuthenticated = this.$auth.isAuthenticated();
      } else {
        this.isAuthenticated = false;
        this.$router.push("/");
      }
      this.profile = data.profile;
    }
  }
};
</script>
