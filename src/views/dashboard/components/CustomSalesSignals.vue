<template>
  <!-- Custom Sales Signals -->
  <v-card-text>
    <v-toolbar flat color="white">
      <v-toolbar-title>Custom Sales Signals</v-toolbar-title>
    </v-toolbar>
    <template>
      <!-- Apollo watched Graphql query -->
      <ApolloQuery
        :query="require('../graphql/TableSalesSignals.gql')"
        :variables="{              
          first: this.itemsPerPage, 
          offset: (this.itemsPerPage * this.page) - this.itemsPerPage, }"
      >
        <template v-slot="{ result: { loading, error, data }, isLoading }">
        <!-- Result -->
            <v-data-table
              :headers="headers"
              v-if="data.companySignalsAggs"
              :items="data.companySignalsAggs"
              :sort-by="['totalCompanies']"
              :sort-desc="[true]"
              @updateOptions="updateOptions"
            >
              <template v-slot:item="{ item, headers}">
                <tr>
                  <td>
                    <router-link
                      :to="`/signals/${item.signal.id}`"
                    >{{ item.signal.name || item.signal.description }}</router-link>
                  </td>
                  <td>{{item.totalCompanies.toLocaleString() || "0"}}</td>
                  <td>{{item.signal.defaultScore.toLocaleString() || "0"}}</td>
                  <td>{{item.signal.group || "-"}}</td>
                </tr>
              </template>
            </v-data-table>

              <!-- No result -->
              <div v-else>No data was returned</div>

              <!-- Loading -->
              <v-row  :justify="center" no-gutters>
                <v-col  cols="12">
                  <v-progress-linear
                  :active="isLoading"
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
        { text: "Custom Signal", value: "customsignal", sortable: false, width: "20%" },
        { text: "Count", value: "totalCompanies", sortable: true, width: "20%" },
        { text: "Score", value: "score", sortable: false, width: "20%" },
        { text: "Group", align: "left", value: "group", sortable: false, width: "20%" }
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

