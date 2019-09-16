<template>
  <v-card class="ma-3">
    <v-card-title>
      <h1 class="display-1">News</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <h2 class="display-1 ma-3">Categorized</h2>
      <v-data-table
        :headers="headers"
        :items="companyNews"
        :items-per-page="pagination.rowsPerPage"
        :footer-props="{
          'items-per-page-options': pagination.rowsPerPageItems
        }"
        class="elevation-1"
        @updatepagination="updatePagination"
        :server-items-length="totalItems"
      >
        <template v-slot:item="{ item, headers }">
          <tr>
            <td>{{ props.item.company.name }}</td>
            <td>
              <router-link :to="`/news/${props.item.id}`">
                <long-paragraph :text="props.item.title"></long-paragraph>
              </router-link>
            </td>
            <td>
              <a
                :key="`news-external-link${props.item.id || ''}`"
                :href="props.item.url || ''"
                target="_blank"
              >visit source</a>
            </td>
            <td>{{ props.item.publishDate }}</td>
            <td>{{ props.item.category || "--"}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
    <news-table-false></news-table-false>
  </v-card>
</template>

<script>
import LongParagraph from "./LongParagraph.vue";
import NewsTableFalse from "./NewsTableFalse.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 25,
        rowsPerPageItems: [25, 50, 100]
      },
      descending: false,
      notCategorized: true,
      sortBy: "",
      totalItems: 10000000,
      headers: [
        { text: "Company", value: "company.name" },
        { text: "Title", value: "title" },
        { text: "Url", value: "props.item.url" },
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
        rowsPerPage = 5,
        sortBy = "",
        totalItems = 10
      }
    }) {
      this.descending = descending;
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.sortBy = sortBy;
      this.totalItems = 5;
    }
  },
  components: {
    LongParagraph,
    NewsTableFalse
  },
  apollo: {
    companyNews: {
      query: gql`
        query searchCompanyNewTrue(
          $companyUid: String
          $first: Int
          $offset: Int
          $notCategorized: Boolean
        ) {
          companyNews(
            companyUid: $companyUid
            first: $first
            offset: $offset
            notCategorized: $notCategorized
          ) {
            company {
              name
            }
            id
            title
            publishDate
            category
            url
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid,
          first: this.pagination.rowsPerPage,
          offset:
            this.pagination.rowsPerPage * this.pagination.page -
            this.pagination.rowsPerPage,
          notCategorized: this.notCategorized
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