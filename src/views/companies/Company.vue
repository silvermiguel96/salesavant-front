<template>
  <v-container fluid>
    <ApolloQuery
      :query="require('./graphql/CompanySelected.gql')"
      :variables="{
        companyUid: $route.params.companiesUid
      }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <v-breadcrumbs
          v-if="data && data.company"
          :large="true"
          :items="[
            {
              text: 'Companies',
              disabled: false,
              href: '/companies'
            },
            {
              text: data.company.name || $route.params.companiesUid,
              disable: true
            }
          ]"
          divider=">"
        >
          <template v-slot:item="props">
            <v-breadcrumbs-item
              :href="props.item.href"
              :class="[props.item.disabled && 'disabled']"
              @click.prevent="$router.push(props.item.href)"
            >{{ props.item.text }}</v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </template>
    </ApolloQuery>
    <v-tabs grow background-color="grey lighten-5" color="primary">
      <!-- Tab Home -->
      <v-tab>Summary</v-tab>
      <v-tab-item>
        <v-container fluid>
          <v-row>
            <v-col md="6" xs="12" class="pt-0">
              <company-profile />
            </v-col>
            <v-col md="6" xs="12" class="pt-0">
              <company-signals />
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <!-- tab comments -->
      <v-tab>Comments</v-tab>
      <v-tab-item>
        <company-comments />
      </v-tab-item>
      <!-- Tab add to playlist -->
      <v-tab>Playlists</v-tab>
      <v-tab-item>
        <add-to-playlist></add-to-playlist>
      </v-tab-item>
      <!-- Tab contacts -->
      <v-tab>Contacts</v-tab>
      <v-tab-item>
        <contact></contact>
      </v-tab-item>
      <!-- tab signals -->
      <v-tab>Signals</v-tab>
      <v-tab-item>
        <signals />
      </v-tab-item>
      <!-- Tab new signals -->
      <v-tab>News</v-tab>
      <v-tab-item>
        <news />
      </v-tab-item>
      <!-- Tab Analytics -->
      <v-tab>Analytics</v-tab>
      <v-tab-item>
        <analytics></analytics>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
// Home
import CompanyProfile from "./components/Home/CompanyProfile.vue";
import CompanySignals from "./components/Home/CompanySignals.vue";
// Comments
import CompanyComments from "./components/comments/comments.vue";
// Signals
import Signals from "./components/Signals/Signals.vue";
// Contacts
import Contact from "./components/Contact/Contact.vue";
// Add To Playlist
import AddToPlaylist from "./components/Add-to-playlist/AddToPlaylist.vue";
// News
import News from "./components/News/News.vue";
// Analytics
import Analytics from "./components/Analytics/Analytics.vue";

export default {
  data() {
    return {};
  },
  components: {
    CompanyProfile,
    CompanyComments,
    CompanySignals,
    News,
    Signals,
    Contact,
    Analytics,
    AddToPlaylist
  }
};
</script>
