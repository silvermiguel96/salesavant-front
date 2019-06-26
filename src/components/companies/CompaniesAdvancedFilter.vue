<template>
  <v-layout>
    <v-dialog v-model="filter" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Filter</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <v-layout>
            <v-flex md10>
              <span class="headline">Company Basic</span>
            </v-flex>
            <v-flex md2>
              <v-btn color="red darken-1" flat @click="filter = false">X</v-btn>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <v-expansion-panel v-model="panel"  expand >
            <v-expansion-panel-content>
              <template v-slot:actions>
                <v-icon color="primary">youtube_searched_for</v-icon>
              </template>
              <template v-slot:header>
                <div class="headline">Search</div>
              </template>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="Search" v-model="search"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat v-on:click="fnSearch" :loading="loading">Search</v-btn>
                </v-card-actions>
              </v-container>
            </v-expansion-panel-content>
            <v-expansion-panel-content>            
              <template v-slot:actions>
                <v-icon color="primary">filter_list</v-icon>
              </template>
              <template v-slot:header>
                <div class="headline">Advanced search</div>
              </template>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                    <v-text-field label="Company" v-model="searchAdvance.name"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field label="Country" v-model="searchAdvance.country"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field label="City" v-model="searchAdvance.city"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                     <v-text-field label="Region" v-model="searchAdvance.region"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                     <v-text-field label="State" v-model="searchAdvance.state"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                     <v-text-field label="Company status" v-model="searchAdvance.status"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12>
                    <label class="title">Number Employees</label>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field label="More" type="number" v-model="searchAdvance.moreThanEmployees"></v-text-field>
                  </v-flex>
                  <v-flex sm6 md6>
                    <v-text-field label="Less" type="number" v-model="searchAdvance.lessThanEmployees"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    flat
                    v-on:click="fnSearchAdvance"
                    :loading="loading">
                  Search Advanced</v-btn>
                </v-card-actions>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="filter = false" >Clean</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { parse } from 'path';
export default {
  data() {
    return {
      filter: false,
      typeButton: "",
      search: "",
      searchAdvance: {
        country: "",
        name: "",
        lessThanEmployees: 0,
        moreThanEmployees: 0,
        status: "",
        region: "",
        state: "",
        city: ""
      },
      panel: [true, false],
      loading: false
    };
  },
  methods: {
    fnSearch() {
      this.loading = true;
      setTimeout(() => {
        this.$emit("changeFieldSerch", this.search);
        this.$emit("typeBtn", this.typeButton = 1)
        this.search = "";
        this.searchAdvance.country = "";
        this.searchAdvance.name = "";
        this.searchAdvance.lessThanEmployees = 0;
        this.searchAdvance.moreThanEmployees = 0;
        this.searchAdvance.status = "";
        this.searchAdvance.region = "";
        this.searchAdvance.state = "";
        this.searchAdvance.city = "";
        this.filter = false;
        this.loading = false;
      }, 1000);
    },
    fnSearchAdvance() {
      this.loading = true;
      setTimeout(() => {
        this.$emit("changeFieldSerchAdvanceName", this.searchAdvance.name);
        this.$emit("changeFieldSerchAdvanceCountry", this.searchAdvance.country);
        this.$emit("changeFieldSerchAdvanceLessThanEmployees", this.searchAdvance.lessThanEmployees = Number(this.searchAdvance.lessThanEmployees));
        this.$emit("changeFieldSerchAdvanceMoreThanEmployees", this.searchAdvance.moreThanEmployees = Number(this.searchAdvance.moreThanEmployees));
        this.$emit("changeFieldSerchAdvanceStatus", this.searchAdvance.status);
        this.$emit("changeFieldSerchAdvanceRegion", this.searchAdvance.region);
        this.$emit("changeFieldSerchAdvanceState", this.searchAdvance.state);
        this.$emit("changeFieldSerchAdvanceCity", this.searchAdvance.city);
        this.$emit("typeBtn", this.typeButton = 2)
        this.searchAdvance.country = "";
        this.searchAdvance.name = "";
        this.searchAdvance.lessThanEmployees = 0;
        this.searchAdvance.moreThanEmployees = 0;
        this.searchAdvance.status = "";
        this.searchAdvance.region = "";
        this.searchAdvance.state = "";
        this.searchAdvance.city = "";
        this.search = "";
        this.filter = false;
        this.loading = false;
      }, 1000);
    }
  }
};
</script>
