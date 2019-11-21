<template>
  <v-card class="ma-3">
    <v-card-title>
      <h1 class="display-1">Signals</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="companySignals.companySignalsList"
        :server-items-length="companySignals.totalResults"
        :items-per-page="options.itemsPerPage"
        :footer-props="{
          'items-per-page-options': [10, 20, 50]
        }"
        :options.sync="options"
        class="mx-2"
        @updateOptions="updateOptions"
      >
        <template v-slot:item="{ item, headers }">
          <tr>
            <td>
              <router-link :to="`/signals/${item.signal.id}`">{{
                item.signal.name || "--"
              }}</router-link>
            </td>
            <td>{{ item.signal.description || "--" }}</td>
            <td>{{ item.signal.group || "--" }}</td>
            <td>{{ item.signal.category || "--" }}</td>
            <td>{{ item.signal.defaultScore || "0" }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import LongParagraph from "../../../../components/common/LongParagraph.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      options: {
        page: 1,
        itemsPerPage: 10
      },
      companySignals: [],
      descending: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
        { text: "Group", value: "group" },
        { text: "Category", value: "category" },
        { text: "Default Score", value: "defaultScore" }
      ]
    };
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.page = page;
      this.itemsPerPage = itemsPerPage;
    }
  },
  components: {
    LongParagraph
  },
  apollo: {
    companySignals: {
      query: gql`
        query searchCompanyPlaylist(
          $companyUid: String
          $first: Int
          $offset: Int
        ) {
          companySignals(
            companyUid: $companyUid
            first: $first
            offset: $offset
          ) {
            totalResults
            companySignalsList {
              id
              signal {
                id
                name
                description
                group
                category
                defaultScore
              }
              score
            }
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid,
          first: this.options.rowsPerPage,
          offset:
            this.options.rowsPerPage * this.options.page -
            this.options.rowsPerPage
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  beforeUpdate() {
    this.$apollo.queries.companySignals;
  }
};
</script>
<style></style>
