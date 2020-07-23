<template>
  <v-app>
    <v-navigation-drawer v-model="drawers" overlay-opacity clipped :permanent="permanent" app>
      <v-list dense>
        <v-list-item-group color="primary">
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link :to="item.router" class="text-decoration">
                <v-list-item-title
                  class="body-2 black--text font-weight-regular text-decoration"
                >{{item.title}}</v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-card>
      <v-toolbar dense class="elevation-0">
        <v-app-bar-nav-icon icon @click="permanent = !permanent"></v-app-bar-nav-icon>
        <v-toolbar-title>Administration</v-toolbar-title>
      </v-toolbar>
      <v-container fluid>
        <users />
      </v-container>
    </v-card>
  </v-app>
</template>

<script>
import Users from "../../components/account/Users.vue";

export default {
  components: {
    Users
  },
  data: () => ({
    drawers: "",
    permanent: false,
    items: [
      { title: "Home", icon: "home", router: "/home" },
      { title: "My Account", icon: "account_box", router: "/admin" },
      { title: "Users", icon: "person", router: "/home" },
      { title: "Data", icon: "layers", router: "/companies-admin" }
    ]
  })
};
</script>

<style scoped>
.text-decoration {
  text-decoration: none;
}
</style>