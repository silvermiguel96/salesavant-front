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
              <v-card-text>
                <v-text-field v-model="userlogin.username" 
                label="Email" 
                type="email" 
                name="email" 
                append-icon="mail"></v-text-field>
                <v-text-field
                  v-model="userlogin.password"
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  :type="show1 ? 'text' : 'password'"
                  label="Password"
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-card-text>
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
import { AUTH_TOKEN } from '../vue-apollo';
export default {
  name: "login",
  data() {
    return {
      userlogin: {
        username: "",
        password: ""
      },
      isAuthenticated: false,
      show1: false
    };
  },
   methods: {
    async login() {
      const dataUser = this.userlogin;
      const Body = JSON.stringify(dataUser);
      console.log("Body", Body);
      const fecthDetails = {
        method: "POST",
        body: Body,
        headers: new Headers({
          "Content-Type": "application/json"
        })
      };
      const result = await fetch(`${process.env.VUE_APP_REST_API_URL}/auth`, fecthDetails)
        .then(res => res.json())
        .catch(error => console.error("Error:", error))
      console.log('token', result)

      if(!!result.access_token){
        localStorage.setItem(AUTH_TOKEN, result.access_token)
        this.$router.go("/home")
      }
    }
  },
  created() {
    if (!!localStorage.getItem(AUTH_TOKEN)) {
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