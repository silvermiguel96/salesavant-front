<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <div class="d-flex align-center justify-center">
          <v-icon color="blue lighten-2" size="20" v-bind="attrs" v-on="on" small>add_box</v-icon>
        </div>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-5" primary-title>Salesforce</v-card-title>
        <v-card-text>
          The name of the SalesForce company selected is: <span class="font-weigth-normal">{{company.sfObject.name }}</span>
          <v-row wrap class="pt-2">
            <v-col cols="12">
              <companies-autocomplete
                playlistType="company"
                @change="onPlaylistAutocompleteChange"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog=false">Close</v-btn>
          <v-btn color="primary" class="text-capitalize" text @click="addObject">Associate</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CompaniesAutocomplete from "../companies/CompaniesAutocomplete.vue";
export default {
  data() {
    return {
      dialog: false,
      companyUid: "",
      value: ""
    };
  },
  props: {
    company: Object
  },
  components: {
    CompaniesAutocomplete
  },
  methods: {
    onPlaylistAutocompleteChange(value) {
      this.value = value;
    },
    addObject(){
      this.$emit("addObjectModal", { company: this.value, objectCompany: this.company})
      this.dialog = false
    }
  }
};
</script>
