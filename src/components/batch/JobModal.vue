<template>
    <v-dialog v-model="dialog" persistent max-width="400">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" outlined rounded v-on="on" min-width="140">
          <slot name="label"></slot>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline"><slot name="title"></slot></v-card-title>
        <v-card-text><slot name="content"></slot></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="dialog = false">Accept</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
      }
    },
    props:{
      jobType: String,
      additionalData: Object
    }
  }
</script>