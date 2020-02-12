<template>
  <v-card-text>
    <v-toolbar flat color="white">
      <v-toolbar-title>Custom Signal Groups</v-toolbar-title>
    </v-toolbar>
    <template>
      <!-- Apollo watched Graphql query -->
      <ApolloQuery
        :query="require('../graphql/SignalsGroupAggs.gql')"
        :variables="{              
          first: this.itemsPerPage, 
          offset: (this.itemsPerPage * this.page) - this.itemsPerPage, }"
      >
        <template v-slot="{ result: { loading, error, data }, isLoading }">
          <!-- Result -->
            <!-- <div>{{ JSON.stringify(data) }}</div> -->
            <v-data-table
              :headers="headers"
              v-if="data"
              :items="data.companySignalsGroupAggs"
              :sort-by="['totalCompanies']"
              :sort-desc="[true]"
              @updateOptions="updateOptions"
            >
              <template v-slot:item="{ item, headers}">
                <tr>
                  <td>
                    <router-link
                      :to="`/signals?search=&group=${item.signalGroup}&category=&searchType=signals`"
                    >{{ item.signalGroup }}</router-link>
                  </td>
                  <td>{{ item.totalCompanies.toLocaleString() }}</td>
                </tr>
              </template>
            </v-data-table>

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
        </template>
      </ApolloQuery>
    </template>
  </v-card-text>
</template>
<script>
export default {
  data() {
    return {
      data: [],
      headers: [
        { text: "Group", align: "left", value: "group", sortable: false,  width: "50%" },
        { text: "Total Companies", value: "totalCompanies", sortable: true, width: "50%" }
      ],
      descending: false,
      page: 1,
      itemsPerPage: 10,
      sortBy: "",
      isFiltered: false
    };
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.page = page;
      this.itemsPerPage = itemsPerPage;
    }
  }
};
</script>
