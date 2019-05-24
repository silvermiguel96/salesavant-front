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
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Company" v-model="name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Country" v-model="country"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="City" v-model="city"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select
                  :items="['Bay Area', 'Los Angeles', 'San Diego']"
                  v-model="region"
                  label="Region"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select
                  :items="['Alabama', 'Alaska', 'Arizona']"
                  v-model="state"
                  label="State"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  :items="['Public', 'Private', 'Acquired']"
                  v-model="status"
                  label="Company status"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm12>
                <label class="title">Number Employees</label>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field
                  label="Init"
                  v-model="employeesMin"
                ></v-text-field>
              </v-flex>
              <v-flex sm6 md6>
                <v-text-field label="End" v-model="employeesMax"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="save = false">Search</v-btn>
          <v-btn color="blue darken-1" flat @click="filter = false"
            >Clean</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- {{ company }} -->
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      filter: false,
      country: "",
      name: "",
      employeesMin: "",
      employeesMax: "",
      status: "",
      region: "",
      state: "",
      city: ""
    };
  }
  /* apollo: {
    playlists: PLAYLISTS
  } */
  // ,
  // methods: {
  //   save () {
  //     console.log(this.$company);
  //   }
  // }
};
</script>
