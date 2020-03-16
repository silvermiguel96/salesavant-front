<template>
  <v-container class="pa-0" fluid>
    <v-card>
      <div class="apollo-example">
        <v-container fluid class="mx-1">
          <v-row no-gutters class="ml-2">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Filter"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <div>
          <!-- Result -->
          <contacts-table
            v-if="playlistContacts"
            :items="playlistContacts.contactsList"
            :totalResults="playlistContacts.totalResults"
            @updateOptions="updateOptions"
          ></contacts-table>
          <!-- Loading -->
          <v-row justify="center" no-gutters>
              <v-col cols="12">
                <v-progress-linear
                :active="!!isLoading"
                color="blue"
                indeterminate
                absolute
                bottom
                query
                ></v-progress-linear>
              </v-col>
          </v-row>
          </div>
        
      </div>
    </v-card>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import ContactsTable from "../../../components/contacts/ContactsTable";

export default {
  data() {
    return {
      headers: [
        { text: "", value: "data-table-expand", width: "4%" },
        {
          text: "Full Name",
          value: "fullName",
          width: "15%",
          sortable: false
        },
        {
          text: "Title",
          value: "companies.title",
          width: "15%",
          sortable: false
        },
        {
          text: "Company",
          value: "companies.name",
          width: "15%",
          sortable: false
        },
        {
          text: "Department",
          value: "companies.deparment",
          width: "10%",
          sortable: false
        },
        {
          text: "Rank",
          value: "companies.rank",
          width: "10%",
          sortable: false
        },
        {
          text: "S.S. Average",
          value: "scaleScoreAverage",
          width: "6%",
          align: "left",
          sortable: true
        },
        {
          text: "C.E. Average",
          value: "capitalEfficiencyScoreAverage",
          width: "6%",
          sortable: true,
          align: "left"
        },
        {
          text: "C.E.E. Average",
          value: "capitalEfficiencyEstimateAverage",
          width: "6%",
          sortable: true,
          align: "left"
        },
        {
          text: "Number of Exits",
          value: "numberOfExits",
          width: "6%",
          sortable: true,
          align: "left"
        }
      ],
      search: "",
      isLoading: true,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy:"",
        sortOrder:""
      }
    };
  },
  components:{
    ContactsTable
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
      console.log(sortBy);
      if (sortBy.length > 0) {
        switch (sortBy[0]) {
          case "scaleScoreAverage":
            this.options.sortBy = "scale_score_average";
          case "capitalEfficiencyScoreAverage":
            this.options.sortBy  = "capital_efficiency_score_average";
          case "capitalEfficiencyEstimateAverage":
            this.options.sortBy  = "capitalEfficiencyEstimate_average";
          case "numberOfExits":
            this.options.sortBy  = "number_of_exits";
        }
      } else {
        this.options.sortBy  = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.options.sortOrder = "desc";
        } else {
          this.options.sortOrder = "asc";
        }
      } else {
        this.options.sortOrder = "";
      }
    }
  },
  apollo: {
    playlistContacts: {
      query: gql`
        query contacsPlaylist($playlistUid: String, $search: String, $sortBy:String, $sortOrder: String, $first: Int, $offset: Int) {
          playlistContacts(playlistUid: $playlistUid, search:$search, sortBy: $sortBy, sortOrder: $sortOrder, first: $first, offset: $offset) {
            totalResults
            contactsList {
              uid
              fullName
              linkedinHandle
              scaleScoreAverage
              capitalEfficiencyScoreAverage
              capitalEfficiencyEstimateAverage
              numberOfExits
              companies {
                title
                isCurrent
                rank
                departament
                company {
                  uid
                  name
                }
                title
                isCurrent
              }
            }
          }
        }
      `,
      variables() {
        return {
          playlistUid: this.$route.params.playlistUid,
          search: this.search,
          sortBy: this.options.sortBy,
          sortOrder: this.options.sortOrder,
          first: this.options.itemsPerPage,
          offset: this.options.itemsPerPage * this.options.page - this.options.itemsPerPage,
        };
      },
      skip(){
        return this.search.length > 0 && this.search.length < 2;
      },
      watchLoading (isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network"
    }
  },
  beforeCreate() {
    this.$apollo.queries.playlistContacts;
  }
};
</script>
