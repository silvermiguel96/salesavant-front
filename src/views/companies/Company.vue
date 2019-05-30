<template>
  <ApolloQuery
    :query="require('./graphql/CompanySelected.gql')"
    :variables="{ company: $route.params.companiesUid, playlist: $route.params.playlistId || '' }"
  >
    <template slot-scope="{ result: { loading, error, data } }">
      <div class="apollo-example">
        <v-breadcrumbs
          v-if="data && data.company && data.playlist"
          :items="[
            {
              text: 'Playlists',
              disabled: false,
              href: '/playlists'
            },
            {
              text: data.playlist.name || 'some playlist',
              disabled: !$route.params.playlistId,
              href: `/playlists/${$route.params.playlistId || ''}`
            },
            {
              text: 'Companies',
              disabled: false,
              href: `/playlists/${$route.params.playlistId || ''}/companies`
            },
            {
              text: data.company.name || data.company.uid,
              disable: true
            }
          ]"
          divider=">"
        ></v-breadcrumbs>
        <v-breadcrumbs
          v-else-if="data && data.company"
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
      <div v-if="loading" class="loading apollo">Loading...</div>

      <!-- Error -->
      <div v-else-if="error" class="error apollo">An error occured</div>

      <!-- Result -->
      <div v-else-if="data" class="result apollo">
        <!-- {{ JSON.stringify(data.company) }} -->
        <v-tabs grow color="grey lighten-5">
          <!-- Tab Home -->
          <v-tab>Home</v-tab>
          <v-tab-item>
            <v-layout row wrap justify-space-around class="mt-3">
              <v-flex md5>
                <company-profile v-if="data.company" :items="data.company" class="result apollo"></company-profile>
              </v-flex>
              <v-flex md6>
                <custom-sales-signals></custom-sales-signals>
              </v-flex>
            </v-layout>
          </v-tab-item>
          <!-- Tab new signals -->
          <v-tab>News Signals</v-tab>
          <v-tab-item>
            <news-signals v-if="data.company.news" :items="data.company.news" class="result apollo"></news-signals>
          </v-tab-item>
          <!-- Tab contact -->
          <v-tab>Contact</v-tab>
          <v-tab-item>
            <contact></contact>
          </v-tab-item>
          <!-- Executive Tracker -->
          <v-tab>Executive tracker</v-tab>
          <v-tab-item>
            <executive-tracker></executive-tracker>
          </v-tab-item>
          <!-- Tab Analytics -->
          <v-tab>Analytics</v-tab>
          <v-tab-item>
            <analytics></analytics>
          </v-tab-item>
          <!-- Tab add to playlist -->
          <v-tab>Add to playlist</v-tab>
          <!-- {{ JSON.stringify(data.company.playlists)}} -->
          <v-tab-item>
            <add-to-playlist
              v-if="data.company.playlists"
              :items="data.company.playlists"
              class="result apollo"
            ></add-to-playlist>
          </v-tab-item>
        </v-tabs>
      </div>

      <!-- No result  -->
      <div v-else class="no-result apollo">No result :(</div>
    </template>
  </ApolloQuery>
</template>

<script>
// Home
import CompanyProfile from "./components/Home/CompanyProfile.vue";
import CustomSalesSignals from "./components/Home/CustomSalesSignals.vue";
// NewsSignals
import NewsSignals from "./components/News-signals/NewsSignals.vue";
// Contacts
import Contact from "./components/Contact/Contact.vue";
// Executive Tracker
import ExecutiveTracker from "./components/Executive-tracker/ExecutiveTracker.vue";
// Analytics
import Analytics from "./components/Analytics/Analytics.vue";
// Add To Playlist
import AddToPlaylist from "./components/Add-to-playlist/AddToPlaylist.vue";
export default {
  data() {
    return {};
  },
  components: {
    CompanyProfile,
    CustomSalesSignals,
    NewsSignals,
    Contact,
    ExecutiveTracker,
    Analytics,
    AddToPlaylist
  }
};
</script>

<style></style>
