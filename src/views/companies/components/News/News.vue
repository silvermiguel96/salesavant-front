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
        :items="companyNews.companyNewsList"
        :server-items-length="companyNews.totalResults" 
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
              <router-link :to="`/news/${item.id}`">
                <long-paragraph :text="item.title"></long-paragraph>
              </router-link>
            </td>
            <td>
              <a
                :key="`news-external-link${item.id || ''}`"
                :href="item.url || ''"
                target="_blank"
                >visit source</a
              >
            </td>
            <td>{{ item.publishDate }}</td>
            <td>{{ item.category || "--" }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
    <news-table-false></news-table-false>
  </v-card>
</template>

<script>
import LongParagraph from "../../../../components/common/LongParagraph.vue";
import NewsTableFalse from "./NewsTableFalse.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      descending: false,
      notCategorized: true,
      companyNews: [],
      sortBy: "",
      totalItems: 10000000,
      headers: [
        { text: "Title", value: "title" },
        { text: "Url", value: "props.item.url" },
        { text: "Publish date", value: "publishDate" },
        { text: "Category", value: "category" }
      ],
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
      this.options.page = options.page;
      this.options.itemsPerPage = options.itemsPerPage;
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
            totalResults
            companyNewsList {
              id
              creationTime
              url
              title
              publishDate
              category
              companyUid
            }
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid,
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage,
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
