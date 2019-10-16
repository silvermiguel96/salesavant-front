<template>
  <v-card class="ma-3">
    <v-card-title>
       <h2 class="display-1"> Contacts</h2>
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
      contact: [],
      headers: [
        { text: 'Company', value: 'Company' },
        { text: 'Name', value: 'Name' },
        { text: 'Title', value: 'Title' },
        { text: 'Bio', value: 'Bio' },
        { text: 'Email', value: 'Email'}
      ]
    }
  }
}
</script>

