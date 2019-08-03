<template>
  <v-card class="ma-3">
    <v-card-title>
      <h1 class="display-1">News</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="companyNews"
        class="elevation-1"
        :pagination.sync="pagination"
        :rows-per-page-items="pagination.rowsPerPageItems"
        :total-items="totalItems"
        @update:pagination="updatePagination"
      >
        <template v-slot:items="props">
          <td>{{ props.item.company.name }}</td>       
          <router-link :to="`/news/${props.item.title}`">
          <long-paragraph :text="props.item.title"></long-paragraph>
          </router-link>
          <td>{{ props.item.publishDate }}</td>
          <td>{{ props.item.category || "--"}}</td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import LongParagraph from "./LongParagraph.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 25,
        rowsPerPageItems: [25, 50, 100]
      },
      newsCompany: [],
      descending: false,
      sortBy: "",
      totalItems: 10000000,
      headers: [
        { text: "Company", value: "company.name" },
        { text: "Title", value: "title" },
        { text: "Publish date", value: "publishDate" },
        { text: "Category", value: "category" }
      ]
    };
  },
  methods: {
    updatePagination({
      dataFromEvent: {
        descending = false,
        page = 1,
        rowsPerPage = 25,
        sortBy = "",
        totalItems = 10000000
      }
    }) {
      this.descending = descending;
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.sortBy = sortBy;
      this.totalItems = totalItems;
    }
  },
  components: {
    LongParagraph
  },
  apollo: {
    companyNews: {
      query: gql`
        query searchCompanyNew($companyUid: String, $first: Int, $offset: Int) {
          companyNews(companyUid: $companyUid, first: $first, offset: $offset) {
            company {
              name
            }
            id
            title
            publishDate
            category
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid,
          first: this.pagination.rowsPerPage,
          offset:
            this.pagination.rowsPerPage * this.pagination.page -
            this.pagination.rowsPerPage
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  beforeCreate() {
    this.$apollo.queries.companyNews;
  }
};
</script>
