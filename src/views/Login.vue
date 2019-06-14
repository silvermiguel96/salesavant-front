<template>
  <v-app>
    <v-content class="bg-comercio">
      <v-container fluid fill-height>
        <v-layout  align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 ma-2">
              <v-toolbar dark color="primary">
                <v-toolbar-title class="pa-2"> <span class="headline">Sale Savant</span></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn
                    icon
                    large
                    target="_blank"
                    slot="activator"
                  >
                    <v-icon large>recent_actors</v-icon>
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-card-text>
                <v-form >
                  <v-text-field prepend-icon="person" name="login" v-model="input.username" label="Login" type="text"></v-text-field>
                  <v-text-field prepend-icon="lock" name="password" v-model="input.password" label="Password" id="password" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="ma-2">
                <v-btn  block color="secondary" v-on:click="login()">Login</v-btn>
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
      input: {
        username: "1",
        password: "1"
      }
    };
  },
  methods: {
    login() {
      if (this.input.username != "" && this.input.password != "") {
        if (
          // this.input.username == this.$parent.mockAccount.username &&
          // this.input.password == this.$parent.mockAccount.password
          this.input.username != "" && this.input.password != ""
        ) {
          this.$emit("authenticated", true);
          this.$router.replace({ name: "home" });
        } else {
          console.log("The username and / or password is incorrect");
        }
      } else {
        console.log("A username and password must be present");
      }
    }
  }
};
</script>

<style scoped>
.bg-comercio{
  background-image: url("/static/comercio2.jpeg");
  background-repeat: no-repeat;
  background-position: 50% 0;
  background-size: cover;
}
.bg-comercio:before{
  position: absolute;
  content:" ";
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index:0;
  background-color: rgba(0,0,0,0.3);
}
</style>