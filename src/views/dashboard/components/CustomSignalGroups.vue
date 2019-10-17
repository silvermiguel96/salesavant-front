<template>
  <v-card-text>
    <v-toolbar flat color="white">
      <v-toolbar-title>Custom Signal Groups</v-toolbar-title>
    </v-toolbar>
    <template>
      <!-- Apollo watched Graphql query -->
      <ApolloQuery
        :query="require('../graphql/signalsGroupAggs.gql')"
        :variables="{ first: rowsPerPage, offset: (rowsPerPage * page) - rowsPerPage }"
      >
        <template slot-scope="{ result: { loading, error, data } }">
          <!-- Loading -->
          <div v-if="loading" class="loading apollo">Loading...</div>

          <!-- Error -->
          <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

          <!-- Result -->
          <div v-else-if="data" class="result apollo">
            <!-- <div>{{ JSON.stringify(data) }}</div> -->
            <v-data-table
              :headers="headers"
              :items="data.signalsGroupAggs"
              class="elevation-1"
              @updatePagination="updatePagination"
            >
              <template v-slot:item="{ item, headers}">
                <tr>
                  <td>
                    <router-link
                      :to="`/signals?search=&group=${item.group}&category=&searchType=signals`"
                    >{{ item.group }}</router-link>
                  </td>
                  <td>{{ item.totalCompanies }}</td>
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
        { text: "Group", align: "left", value: "group" },
        { text: "Total Companies", value: "totalCompanies" }
      ],
      descending: false,
      page: 1,
      rowsPerPage: 5,
      sortBy: "",
      totalItems: 5,
      isFiltered: false
    };
  },
  methods: {
    updatePagination({
      dataFromEvent: {
        descending = false,
        page = 1,
        rowsPerPage = 5,
        sortBy = "",
        totalItems = 5
      }
    }) {
      this.descending = descending;
      this.page = page;
      this.rowsPerPage = rowsPerPage;
      this.sortBy = sortBy;
      this.totalItems = 5;
    }
  }
};
</script>
