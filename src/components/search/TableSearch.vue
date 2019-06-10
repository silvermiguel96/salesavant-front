<template>
<v-card>
  <v-card-text>
    <v-layout justify-end row wrap>
      <v-flex xl4 md4>
        <v-text-field 
        v-model="search" 
        append-icon="search" 
        label="Search" 
        single-line hide-details
        ></v-text-field>
      </v-flex>
    </v-layout>
  </v-card-text>
  <v-card-text>
    <v-data-table 
    :headers="headers" 
    :items="items" 
    :search="search"
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
      search: '',
      items: [],
      headers: [
        { text: 'Company' , value: 'company'},
        { text: 'Description' , value: 'description'},
        { text: 'City' , value: 'city'},
        { text: 'State', value: 'state'},
        { text: 'Country' , value: 'country'},
        { text: 'Empl.', value: 'empl' },
        { text: 'Website' , value: 'website'},
        { text: 'Vertical', value: 'vertical' }
      ]
    }
  }
}
</script>

