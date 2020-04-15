<template>
  <v-card>
    <v-card-title>
      <h1 class="headline">News</h1>
    </v-card-title>
    <v-divider></v-divider>
    <news-table-true></news-table-true>
    <news-table-false></news-table-false>
  </v-card>
</template>

<script>
import NewsTableFalse from "./NewsTableFalse.vue";
import NewsTableTrue from "./NewsTableTrue.vue";
import gql from "graphql-tag";
export default {
  components: {
    NewsTableFalse,
    NewsTableTrue
  }
};
</script>
