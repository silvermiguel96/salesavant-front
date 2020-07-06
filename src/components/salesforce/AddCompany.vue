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
          The name of company select is <span class="font-weigth-normal">{{ JSON.parse(company.sfObject).name }}</span>
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
      console.log("value", value)
      console.log("companySalesforce", this.company)
    }
  }
};
</script>
<style scoped>
.code {
  color: rgba(0, 0, 0, 0.67);
  background: transparent;
  height: 0;
  font-family: sans-serif;
}
</style>