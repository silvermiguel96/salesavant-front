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
      <v-tab class="text-capitalize">Summary</v-tab>
      <v-tab-item>
        <v-container fluid class="pt-0">
          <v-row>
            <v-col md="6" xs="12" class="pl-0 pt-0">
              <company-profile />
            </v-col>
            <v-col md="6" xs="12" class="px-0 pt-0">
              <company-signals />
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
      <!-- tab comments -->
      <v-tab class="text-capitalize">Comments</v-tab>
      <v-tab-item>
        <company-comments />
      </v-tab-item>
      <!-- Tab contacts -->
      <v-tab class="text-capitalize">Contacts</v-tab>
      <v-tab-item>
        <company-contacts></company-contacts>
      </v-tab-item>
      <!-- tab signals -->
      <v-tab class="text-capitalize">Signals</v-tab>
      <v-tab-item>
        <signals />
      </v-tab-item>
      <!-- Tab new signals -->
      <v-tab class="text-capitalize">News</v-tab>
      <v-tab-item>
        <news />
      </v-tab-item>
      <!-- Tab add to playlist -->
      <v-tab class="text-capitalize">Playlists</v-tab>
      <v-tab-item>
        <add-to-playlist></add-to-playlist>
      </v-tab-item>
      <!-- Tab Analytics -->
      <v-tab class="text-capitalize">Analytics</v-tab>
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
import CompanyContacts from "./components/Contacts/Contacts.vue";
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
    CompanyContacts,
    CompanySignals,
    News,
    Signals,
    Analytics,
    AddToPlaylist
  }
};
</script>
