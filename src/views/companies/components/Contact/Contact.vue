<template>
  <v-card class="ma-3">
    <v-card-title> 
      <!-- Find Contact  -->
      <v-layout row>
        <v-flex md2 class="ma-2">
            <h2 class="headline"> Find Targeted Titles</h2>
        </v-flex>
        <v-flex md1>
            <v-btn dark color="light-blue darken-1">
              <v-icon >search</v-icon>
              <!-- <h2 class="headline">Find</h2> -->
            </v-btn>
        </v-flex >
        <v-spacer></v-spacer>
        <v-flex md4>
          <v-text-field
          label="Search Titles"
          placeholder="(example: Chief Marketing office)">
          </v-text-field>
        </v-flex>
        <v-flex md1>
            <v-btn dark color="light-blue darken-1">
              <v-icon >search</v-icon>
              <!-- <h2 class="headline">Find</h2> -->
            </v-btn>
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-divider></v-divider>
    <!-- Table search -->
    <v-card-text>
      <v-card>
        <v-card-title>
          <h2 class="headline"> Contacts</h2>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="contact"
          :search="search"
        >
          <template v-slot:items="props">
            <td>

            </td>
          </template>
          <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="warning">
              Your search for "{{ search }}" found no results.
            </v-alert>
          </template>
        </v-data-table>
      </v-card>
    </v-card-text>
    <!-- Find Email -->
    <v-card-title>
      Find Email
    </v-card-title>
    <v-card-text>
      <v-layout row wrap justify-space-around>
        <v-flex md3 class="mr-1">
          <v-text-field
          label="Domain"
          placeholder="(example: conversica.com)"
          ></v-text-field>
        </v-flex>
        <v-flex md3>
          <v-text-field
          label="First Name"
          ></v-text-field>
        </v-flex>
        <v-flex md3>
          <v-text-field
          label="Last Name"
          ></v-text-field>
        </v-flex>
        <v-flex md1>
          <v-btn dark color="blue">
            <v-icon >search</v-icon>
          </v-btn>
        </v-flex>

      </v-layout>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      search: '',
      contact: [],
      headers: [
        { text: 'Connextions', value: 'Connextions'},
        { text: 'First', value: 'First' },
        { text: 'Last', value: 'Last' },
        { text: 'Title', value: 'Title'},
        { text: 'Email', value: 'Email'},
        { text: 'Find', value: 'Find' },
        { text: 'Department', value: 'Department' },
        { text: 'Linkedin', value: 'Linkedin' }
      ]
    }
  }
}
</script>
<style>

</style>
