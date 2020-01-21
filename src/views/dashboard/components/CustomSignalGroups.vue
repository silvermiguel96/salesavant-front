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
        { text: "Group", align: "left", value: "group", sortable: false },
        { text: "Total Companies", value: "totalCompanies", sortable: true }
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
