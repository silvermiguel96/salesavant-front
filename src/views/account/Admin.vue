<template>
  <v-app>
    <v-navigation-drawer
      :width="190"
      v-model="drawers"
      overlay-opacity
      clipped
      :permanent="permanent"
      color="primary"
      app
    >
      <v-list dense>
        <v-list-item-group v-model="item" color="white">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.router">
            <v-list-item-icon>
              <v-icon class="white--text" v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                class="title-2 white--text font-weight-regular text-decoration"
                :to="item.router"
                v-text="item.title"
              />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-card>
      <v-toolbar dense class="elevation-0">
        <v-app-bar-nav-icon icon @click="permanent = !permanent"></v-app-bar-nav-icon>
        <v-toolbar-title>Users</v-toolbar-title>
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
    Users,
  },
  data: () => ({
    drawers: "",
    permanent: false,
    item: 1,
    items: [
      { title: "My Account", icon: "account_box", router: "/home" },
      { title: "Users", icon: "person", router: "/admin" },
      { title: "Data", icon: "layers", router: "/companies-admin" },
    ],
  }),
};
</script>

<style scoped>
.text-decoration {
  text-decoration: none;
}
</style>