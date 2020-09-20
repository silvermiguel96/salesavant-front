<template>
  <v-app>
    <v-content class="bg-comercio">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" v-if="!isAuthenticated">
              <v-toolbar dark color="primary">
                <v-toolbar-title>
                  <v-img
                    :src="require('../assets/salesavant_header.png')"
                    width="180"
                    alt="SaleSavant"
                  ></v-img>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon large target="_blank" slot="activator">
                    <v-icon large>recent_actors</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-card-text>
                <v-text-field
                  v-model="userlogin.username"
                  autocomplete="off"
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  id="field-login-email"
                  append-icon="mail"
                ></v-text-field>
                <v-text-field
                  v-model="userlogin.password"
                  autocomplete="off"
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  :type="show1 ? 'text' : 'password'"
                  label="Password"
                  placeholder="Password"
                  id="field-login-password"
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-card-text>
              <v-card-actions class="ma-2">
                <v-btn id="button-login" block color="primary" v-on:click="login()">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      userlogin: {
        username: "",
        password: "",
      },
      show1: false,
    };
  },
  created() {
    if (this.isAuthenticated) {
      console.log("User isAuthenticated redirect to home");
      this.$router.push("/home");
    }
  },
  methods: {
    async login() {
      const fecthDetails = {
        method: "POST",
        body: JSON.stringify(this.userlogin),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      };
      const result = await fetch(
        `${process.env.VUE_APP_REST_API_URL}/auth`,
        fecthDetails
      )
        .then((res) => res.json())
        .catch((error) => console.error("Error:", error));
      console.log("access_token", result);
      if (!!result.access_token) {
        this.$store.commit("createSession", {
          userEmail: this.userlogin.username,
          userToken: result.access_token,
        });
        this.$router.push("/home");
      }
    },
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.userToken ? true : false;
    },
  },
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