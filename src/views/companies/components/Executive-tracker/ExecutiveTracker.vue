<template>
  <v-card class="ma-3">
    <v-card-title>
       <h2 class="headline"> Contacts</h2>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="contact"
        class="elevation-1"
      >
        <template v-slot:items="props">
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      headers: [
        { text: 'Company' },
        { text: 'Name' },
        { text: 'Title' },
        { text: 'Bio' },
        { text: 'Email'}
      ]
    }
  }
}
</script>

