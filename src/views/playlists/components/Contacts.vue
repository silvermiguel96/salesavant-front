<template>
  <v-container fluid>
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
        <!-- Apollo watched Graphql query -->
        <v-data-table
          v-if="!!playlistContacts"
          :headers="headers"
          :items="playlistContacts.contactsList"
          :server-items-length="playlistContacts.totalResults"
          :items-per-page="options.itemsPerPage"
          :footer-props="{
            'items-per-page-options': [10, 20, 50]
          }"
          :options.sync="options"
          class="mx-2"
          @update:options="updateOptions"
          :single-expand="true"
          expanded.sync="expanded"
          item-key="uid"
          show-expand
        >
          <template v-slot:item.fullName="{ item }">
            <router-link
              class="subtitle-2 font-weight-medium"
              :to="`/contacts/${item.uid}`"
            >{{ item.fullName }}</router-link>
          </template>
          <template v-slot:item.companies.title="{ item }">
            <div v-for="select in item.companies" :key="select.uid">
              <span v-if="select.isCurrent">{{ select.title }}</span>
            </div>
          </template>
          <template v-slot:item.companies.name="{ item }">
            <div v-for="select in item.companies" :key="select.uid">
              <router-link
                v-if="select.isCurrent"
                :to="`/companies/${select.company.uid}`"
              >{{ select.company.name }}</router-link>
            </div>
          </template>
          <template v-slot:item.companies.deparment="{ item }">
            <p v-if="item.companies.departament">{{ item.companies.departament || "--" }}</p>
            <p v-else>--</p>
          </template>
          <template v-slot:item.companies.rank="{ item }">
            <p v-if="item.companies.rank">{{ item.companies.rank }}</p>
            <p v-else>--</p>
          </template>
          <template v-slot:item.scaleScoreAverage="{ item }">
            <p v-if="item.scaleScoreAverage">{{ item.scaleScoreAverage }}</p>
            <p v-else>--</p>
          </template>
          <template v-slot:item.capitalEfficiencyScoreAverage="{ item }">
            <p v-if="item.capitalEfficiencyScoreAverage">{{ item.capitalEfficiencyScoreAverage }}</p>
            <p v-else>--</p>
          </template>
          <template v-slot:item.capitalEfficiencyEstimateAverage="{ item }">
            <p v-if="item.capitalEfficiencyEstimateAverage">{{ item.capitalEfficiencyEstimateAverage }}</p>
            <p v-else>--</p>
          </template>
          <template v-slot:item.numberOfExits="{ item }">
            <p v-if="item.numberOfExits">{{ item.numberOfExits }}</p>
            <p v-else>--</p>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td class="ma-0 pa-0" :colspan="headers.length">
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr v-for="job in item.companies" :key="job.uid">
                      <td style="width:4%;"></td>
                      <td style="width:15%;"></td>
                      <td style="width:15%;">{{ job.title || "" }}</td>
                      <td style="width:15%;">
                        <router-link
                          :to="`/companies/${job.company.uid}`"
                        >{{ job.company.name || "" }}</router-link>
                      </td>
                      <td style="width:10%;"></td>
                      <td style="width:10%;"></td>
                      <td style="width:6%;">{{ job.company.scaleScore || "--" }}</td>
                      <td style="width:6%;">{{ job.company.capitalEfficiencyScore || "--" }}</td>
                      <td style="width:6%;">{{ job.company.capitalEfficiencyEstimate || "--" }}</td>
                      <td style="width:6%;">--</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-divider></v-divider>
              <!-- </div> -->
            </td>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import gql from "graphql-tag";

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
      items: [],
      search: "",
      sortBy:"",
      sortOrder:"",
      options: {
        page: 1,
        itemsPerPage: 10
      }
    };
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
            this.sortBy = "scale_score_average";
          case "capitalEfficiencyScoreAverage":
            this.sortBy  = "capital_efficiency_score_average";
          case "capitalEfficiencyEstimateAverage":
            this.sortBy  = "capitalEfficiencyEstimate_average";
          case "numberOfExits":
            this.sortBy  = "number_of_exits";
        }
      } else {
        this.sortBy  = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.sortOrder = "desc";
        } else {
          this.sortOrder = "asc";
        }
      } else {
        this.sortOrder = "";
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
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
          first: this.options.itemsPerPage,
          offset: this.options.itemsPerPage * this.options.page - this.options.itemsPerPage,
        };
      },
      skip(){
        return this.search.length > 0 && this.search.length < 2;
      },
      fetchPolicy: "cache-and-network"
    }
  },
  beforeCreate() {
    this.$apollo.queries.playlistContacts;
  }
};
</script>
