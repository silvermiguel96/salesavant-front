<template>
  <v-layout class="ma-3">
    <v-dialog v-model="filter" persistent max-width="800px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Filter</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <v-layout>
            <v-flex md11>
              <span class="headline">Search for Signals on the Website and NewsAdvanced</span>
            </v-flex>
            <v-flex md1>
              <v-btn fab small color="red darken-1" flat @click="filter = false">X</v-btn>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Website Keywords" placeholder="Search keyword in website" v-model="websitekeywords"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="Most Frequent Words" placeholder="Enter keyword" v-model="mostfrequentwords"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="News" placeholder="Search keyword in the news" v-model="news"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select
                  :items="['New Release', 'Partnership', 'Funding Event', 'Acquisition']"
                  v-model="newscategory"
                  label="News Category"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select
                  :items="['Last 7 days', 'Last 30 days', 'Last 3 month']"
                  v-model="newsdate"
                  label="News Date"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  :items="['Public', 'Private', 'Acquired']"
                  v-model="companystatus"
                  label="Company status"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  :items="['Sotfware', 'Other']"
                  v-model="technology"
                  label="Technology"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  :items="['(Advertising) Advertising, Public Relations', '(Advertising) Public Relations Age']"
                  v-model="naicscode"
                  label="NAICS Code"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  :items="[ 'High', 'Medium', 'Low' ]"
                  v-model="momentum"
                  label="Momentum"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-text-field label="NAICS Category" placeholder="NAICS Category" v-model="naicscategory"></v-text-field>
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
      websitekeywords: '',
      mostfrequentwords: '',
      news: '',
      newscategory: '',
      newsdate: '',
      companystatus: '',
      technology: '',
      naicscode: '',
      momentum: '',
      naicscategory: ''
    };
  }
};
</script>
