<template>
  <ApolloQuery
    :query="require('../graphql/NewsSearchTitle.gql') "
    :variables="{ id: $route.params.newsId }"
  >
    <template slot-scope="{ result: { loading, error, data } }">
      <div class="apollo-example">
        <v-breadcrumbs
          :items="[
            {
              text: 'news',
              disabled: false,
              href: '/news'
            },
            {
              text: $route.params.newsId ,
              disabled: true,
            },
          ]"
          divider=">"
        ></v-breadcrumbs>
      </div>
      <!-- Loading -->
      <div v-if="loading" class="loading apollo">Loading...</div>

      <!-- Error -->
      <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

      <!-- Result -->
      <div v-else-if="data" class="result apollo">
        <!-- {{ JSON.stringify(data) }} -->
        <v-container>
          <v-card>
            <v-card-title>
              <h1 class="display-1">News</h1>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <h5 class="subheading font-weight-bold">
                Id:
                <span class="body-1">{{ data.newsArticle.id }}</span>
              </h5>
            </v-card-text>
            <v-card-text>
              <h3 class="subheading font-weight-bold">
                Title:
                <span class="subheading">{{ data.newsArticle.title || "--"}}</span>
              </h3>
            </v-card-text>
            <v-card-text>
              <h3 class="subheading font-weight-bold">
                Category:
                <span class="subheading">{{ data.newsArticle.category || "--"}}</span>
              </h3>
            </v-card-text>
            <v-card-text>
              <h3 class="subheading font-weight-bold">
                Search News:
                <span class="subheading">{{ data.newsArticle.searchNews }}</span>
              </h3>
            </v-card-text>
            <v-card-text>
              <h3 class="subheading font-weight-bold">
                Publish date:
                <span class="subheading">{{ data.newsArticle.publishDate }}</span>
              </h3>
            </v-card-text>
            <v-card-text>
              <h3 class="subheading font-weight-bold">
                Creation dime:
                <span class="subheading">{{ data.newsArticle.creationTime }}</span>
              </h3>
            </v-card-text>
            <v-card-text>
              <h3 class="subheading font-weight-bold">
                Url:
                <v-btn flat small
                  class="subheading green"
                  target="_black"
                  :href="`${ data.newsArticle.url}`"
                  dark
                >view url</v-btn>
              </h3>
            </v-card-text>
          </v-card>
        </v-container> 
      </div>

      <!-- No result  -->
      <div v-else class="no-result apollo">Loading...</div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
