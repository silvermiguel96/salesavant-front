<template>
  <v-card-text>
    <!-- Apollo watched Graphql query -->
    <h2 class="display-1 ma-3">Not categorized</h2>
    <ApolloQuery
      :query="require('./graphql/NewsNotCategorized.gql')"
      :variables="{
        companyUid: this.$route.params.companiesUid,
        first: this.options.itemsPerPage,
        offset:
          this.options.itemsPerPage * this.options.page -
          this.options.itemsPerPage,
        notCategorized: notCategorized
      }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
          <!-- -<div>{{ JSON.stringify(data) }}</div>  -->
          <v-data-table
            :headers="headers"
            :items="data.companyNews.companyNewsList"
            :server-items-length="data.companyNews.totalResults"
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
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">Loading...</div>
      </template>
    </ApolloQuery>
  </v-card-text>
</template>

<script>
import LongParagraph from "./LongParagraph.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      options: {
        page: 1,
        itemsPerPage: 10
      },
      newsCompany: [],
      notCategorized: false,
      headers: [
        { text: "Title", value: "title" },
        { text: "Url", value: "props.item.url" },
        { text: "Publish date", value: "publishDate" },
        { text: "Category", value: "category" }
      ]
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
    LongParagraph
  }
};
</script>
