<template>
  <div class="apollo-example">
    <v-breadcrumbs :items="items" divider=">"></v-breadcrumbs>
    <h1>{{ items[items.length - 1] }}</h1>

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
                <v-btn color="red darken-1" flat @click="filter = false"
                  >X</v-btn
                >
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    label="Company"
                    v-model="company"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field
                    label="Country"
                    v-model="country"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field label="City"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-select
                    :items="['Bay Area', 'Los Angeles', 'San Diego']"
                    label="Region"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-select
                    :items="['Alabama', 'Alaska', 'Arizona']"
                    label="State"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select
                    :items="['Public', 'Private', 'Acquired']"
                    label="Company status"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm12>
                  <label class="title">Number Employees</label>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field label="Init"></v-text-field>
                </v-flex>
                <v-flex sm6 md6>
                  <v-text-field label="End"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="save = false"
              >Search</v-btn
            >
            <v-btn color="blue darken-1" flat @click="filter = false"
              >Clean</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- {{ company }} -->
    </v-layout>
    <!-- Apollo watched Graphql query -->
    <ApolloQuery :query="require('./Companies.gql')" :variables="null">
      <template slot-scope="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occured</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
          <!---<div>{{ JSON.stringify(data) }}</div>-->
          <companies-table
            v-if="data.companies.length"
            :items="data.companies"
            class="result apollo"
          ></companies-table>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
import CompaniesTable from "./components/CompaniesTable.vue";
export default {
  data() {
    return {
      items: ["Companies"],
      filter: false,
      company: ""
    };
  },
  components: { CompaniesTable }
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

<style scoped>
.form,
.input,
.apollo,
.message {
  padding: 12px;
}

label {
  display: block;
  margin-bottom: 6px;
}

.input {
  font-family: inherit;
  font-size: inherit;
  border: solid 2px #ccc;
  border-radius: 3px;
}

.error {
  color: red;
}

.images {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
  grid-gap: 10px;
}

.image-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  border-radius: 8px;
}

.image {
  max-width: 100%;
  max-height: 100%;
}

.image-input {
  margin: 20px;
}
</style>
