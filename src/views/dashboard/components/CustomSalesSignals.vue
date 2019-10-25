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
        :variables="{ first: rowsPerPage, offset: (rowsPerPage * page) - rowsPerPage }"
      >
        <template slot-scope="{ result: { loading, error, data } }">
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>
          <!-- Result -->
          <div v-else-if="data" class="result apollo">
            <!-- <div>{{ JSON.stringify(data) }}</div> -->
            <v-data-table
              :headers="headers"
              :items="data.signalsAggs"
              class="elevation-1"
              @updatePagination="updatePagination"
            >
              <template v-slot:item="{ item, headers}">
                <tr>
                  <td>
                    <router-link
                      :to="`/signals/${item.signal.id}`"
                    >{{ item.signal.name || "--"}}</router-link>
                  </td>
                  <td>{{item.totalCompanies || "0"}}</td>
                  <td>{{item.signal.defaultScore || "0"}}</td>
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
        { text: "Custom Signal", value: "customsignal" },
        { text: "Count", value: "count" },
        { text: "Score", value: "score" },
        { text: "Group", align: "left", value: "group" }
      ],
      descending: false,
      page: 1,
      rowsPerPage: 25,
      sortBy: "",
      totalItems: 25,
      isFiltered: false
    };
  },
  methods: {
    updatePagination({
      dataFromEvent: {
        descending = false,
        page = 1,
        rowsPerPage = 25,
        sortBy = "",
        totalItems = 25
      }
    }) {
      this.descending = descending;
      this.page = page;
      this.rowsPerPage = rowsPerPage;
      this.sortBy = sortBy;
      this.totalItems = 25;
    }
  }
};
</script>

