<template>
  <ApolloQuery
    :query="require('./graphql/CompanySelected.gql')"
    :variables="{ uid: $route.params.companiesUid }"
  >
    <template slot-scope="{ result: { loading, error, data } }">
      <div class="apollo-example">
        <v-breadcrumbs
          v-if="data && data.company"
          :items="[
            {
              text: 'Companies',
              disabled: false,
              href: '/companies'
            },
            {
              text: data.company.name || data.company.uid,
              disable: true
            }
          ]"
          divider=">"
        ></v-breadcrumbs>
        <v-breadcrumbs
          v-else
          :items="[
            {
              text: 'Companies',
              disabled: false,
              href: '/companies'
            },
            {
              text: $route.params.companiesUid,
              disable: true
            }
          ]"
        ></v-breadcrumbs>
      </div>
      <!-- Loading -->
      <div v-if="loading" class="loading apollo">
        Loading...
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error apollo">An error occured</div>

      <!-- Result -->
      <div v-else-if="data" class="result apollo">
        <!-- {{ JSON.stringify(data.company) }} -->
        <company-profile
          v-if="data.company"
          :items="data.company"
          class="result apollo"
        >
        </company-profile>
      </div>

      <!-- No result  -->
      <div v-else class="no-result apollo">No result :(</div>
    </template>
  </ApolloQuery>
</template>

<script>
import CompanyProfile from "./components/CompanyProfile.vue";

export default {
  data() {
    return {};
  },
  components: {
    CompanyProfile
  }
};
</script>

<style></style>
