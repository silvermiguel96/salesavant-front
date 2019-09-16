<template>
  <v-layout row justify-center>
    <v-btn color="primary" text @click.stop=" dialog = true "><v-icon>zoom_in</v-icon></v-btn>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline text-capitalize">{{header}} Details</v-card-title>
        <v-card-text v-for="(item, index) in items" :key="index">
          <div class="body-1"><span class="title">Name:</span> {{ item.name }}</div>
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
