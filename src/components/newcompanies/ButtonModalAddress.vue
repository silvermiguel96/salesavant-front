<template>
  <v-layout row justify-center>
    <v-btn color="primary" flat @click.stop=" dialog = true "><v-icon>zoom_in</v-icon></v-btn>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline text-capitalize">Information</v-card-title>
        <v-card-text>
            <div class="body-1"><span class="title">Address: </span>{{ items.address1 || '' }} {{ items.address2 || '' }}</div>      
            <div class="body-1"><span class="title">City: </span>{{ items.city || '' }}</div>    
            <div class="body-1"><span class="title">State: </span>{{ items.state || '' }}</div>
            <div class="body-1"><span class="title">Zip: </span>{{ items.zip  || ''}}</div>  
            <div class="body-1"><span class="title">Country:</span>{{ items.country  || ''}}</div>    
            <div class="body-1"><span class="title">Iso country code: </span>{{ items.iso_country_code  || ''}}</div>    
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat @click="dialog = false">Close</v-btn>
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
    items: Object,
    header: [],
    props: []
  }
};
</script>
