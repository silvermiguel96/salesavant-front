<template>
  <v-app>
    <v-content class="bg-comercio">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" v-if="!isAuthenticated">
              <v-toolbar dark color="primary">
                <v-toolbar-title>
                  <img
                    src="/static/salesavant_header.png"
                    alt="SaleSavant"
                    style="width: 240px; max-width: 80%; margin: 1em;"
                  />
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon large target="_blank" slot="activator">
                    <v-icon large>recent_actors</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-card-actions class="ma-2">
                <v-btn block color="secondary" v-on:click="login()">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import authService from "../auth/authService";

export default {
  name: "login",
  data() {
    return { isAuthenticated: false };
  },
  methods: {
    login() {
      this.$auth.login();
    }
  },
  created() {
    if (this.$auth.isAuthenticated()) {
      this.$router.push("/home");
    }
  }
};
</script>

<style scoped>
.bg-comercio {
  background-image: url("/static/bgComercio.jpeg");
  background-repeat: no-repeat;
  background-position: 50% 0;
  background-size: cover;
}
.bg-comercio:before {
  position: absolute;
  content: " ";
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>