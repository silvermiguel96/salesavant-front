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
        <template slot-scope="{ result: { loading, error, data } }">
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>
          <!-- Result -->
          <div v-else-if="data" class="result apollo">
            <!-- <div>{{ JSON.stringify(data) }}</div> -->
            <v-data-table
              :headers="headers"
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
          </div>
          <!-- No result -->
          <div v-else class="no-result apollo">Loading...</div>
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

