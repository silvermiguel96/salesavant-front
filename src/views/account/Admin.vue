<template>
  <v-card>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      height="94vh"    
      width="180" 
      left
      small
      overlay-opacity
    >
      <v-list-item>
        <v-list-item-title class="title">Admin</v-list-item-title>
        <v-btn icon @click.stop="drawer = !drawer">
          <v-icon>keyboard_arrow_left</v-icon>
        </v-btn>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="body-2 font-weight-regular">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-container fluid>
          <v-app-bar-nav-icon small dense @click="drawer = !drawer"></v-app-bar-nav-icon> Admin
        <users />
    </v-container>
  </v-card>
</template>

<script>
import Users from "../../components/account/Users.vue";
export default {
  data() {
    return {
      drawer: true,
      miniVariant: true,
      items: [
        { title: "Home", icon: "home" },
        { title: "My Account", icon: "account_box" },
        { title: "Users", icon: "person" }
      ],
      mini: true
    };
  },
  components: {
    Users
  }
};
</script>