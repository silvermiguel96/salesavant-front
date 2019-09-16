<template>
  <v-layout row justify-center>
    <v-btn color="primary" text @click.stop=" dialog = true "><v-icon>zoom_in</v-icon></v-btn>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline text-capitalize">{{header}} Details</v-card-title>
        <v-card-text v-for="(item, index) in items" :key="index">
            <div class="body-1"><span class="title">Web domain: </span>{{ item.webdomain }}</div>
            <div class="body-1"><span class="title">Has email: </span>{{ item.domain_has_email }}</div>
            <div class="body-1"><span class="title">Has Website: </span>{{ item.domain_has_website }}</div>
            <div class="body-1"><span class="title">Email Hosting: </span>{{ item.domain_is_email_hosting }}</div>
            <div class="body-1"><span class="title">Web Rank: </span>{{ item.orb_web_rank }}</div>   
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      dialog: false
    };
  },
  props: {
    items: Array,
    header: String,
    props: []
  }
};
</script>
