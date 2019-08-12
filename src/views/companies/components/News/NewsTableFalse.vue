<template>
  <!-- Apollo watched Graphql query -->
  <v-card-text>
  <h2>Not categorized</h2>
    <ApolloQuery
      :query="require('./graphql/NewsNotCategorized.gql')"
      :variables="{ companyUid: this.$route.params.companiesUid, first: pagination.rowsPerPage, offset: (pagination.rowsPerPage * pagination.page) - pagination.rowsPerPage, notCategorized: notCategorized}"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
          <!-- -<div>{{ JSON.stringify(data) }}</div> -->
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="data.companyNews"
              class="elevation-1"
              :pagination.sync="pagination"
              :rows-per-page-items="pagination.rowsPerPageItems"
              :total-items="totalItems"
              @update:pagination="updatePagination"
            >
              <template v-slot:items="props">
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
              </template>
            </v-data-table>
          </v-card-text>
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
      pagination: {
        page: 1,
        rowsPerPage: 25,
        rowsPerPageItems: [25, 50, 100]
      },
      newsCompany: [],
      descending: false,
      notCategorized: "",
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
  }
};
</script>
