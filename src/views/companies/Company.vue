<template>
  <v-container fluid>
    <ApolloQuery
      :query="
        $route.params.playlistId
          ? require('./graphql/CompanyWithPlayList.gql')
          : require('./graphql/CompanySelected.gql')
      "
      :variables="{
        company: $route.params.companiesUid,
        playlist: $route.params.playlistId || ''
      }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <div class="apollo-example">
          <v-breadcrumbs
            :large="true"
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
          >
            <template v-slot:item="props">
              <v-breadcrumbs-item
                :href="props.item.href"
                :class="[props.item.disabled && 'disabled']"
                @click.prevent="$router.push(props.item.href)">
                {{ props.item.text }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
          <v-breadcrumbs
            :large="true"
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
          >
            <template v-slot:item="props">
              <v-breadcrumbs-item
                :href="props.item.href"
                :class="[props.item.disabled && 'disabled']"
                @click.prevent="$router.push(props.item.href)">
                {{ props.item.text }}
            </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
          <v-breadcrumbs
            :large="true"
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
          >
            <template v-slot:item="props">
              <v-breadcrumbs-item
                :href="props.item.href"
                :class="[props.item.disabled && 'disabled']"
                @click.prevent="$router.push(props.item.href)">
                {{ props.item.text }}
              </v-breadcrumbs-item>
            </template> 
          </v-breadcrumbs>
        </div>
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <!--<div v-else-if="error" class="error apollo">An error occured</div>-->

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
          <!-- {{ JSON.stringify(data.company) }} -->
          <v-tabs grow background-color="grey lighten-5" color="primary">
            <!-- Tab Home -->
            <v-tab>Home</v-tab>
            <v-tab-item>
              <v-layout wrap justify-space-around class="mt-3">
                <v-flex xs12 md5 class="ma-2">
                  <company-profile />
                </v-flex>
                <v-flex xs12 md6 class="ma-2">
                  <custom-sales-signals />
                </v-flex>
              </v-layout>
            </v-tab-item>
            <!-- tab signals -->
            <v-tab>Signals</v-tab>
            <v-tab-item>
              <signals />
            </v-tab-item>
            <!-- Tab contacts -->
            <v-tab>Contacts</v-tab>
            <v-tab-item>
              <contact></contact>
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
            <!-- Tab add to playlist -->
            <v-tab>Add to playlist</v-tab>
            <!-- {{ JSON.stringify(data.company.playlists)}} -->
            <v-tab-item>
              <add-to-playlist></add-to-playlist>
            </v-tab-item>
          </v-tabs>
        </div>

        <!-- No result  -->
        <div v-else class="no-result apollo">Loading...</div>
      </template>
    </ApolloQuery>
  </v-container>
</template>

<script>
// Home
import CompanyProfile from "./components/Home/CompanyProfile.vue";
import CustomSalesSignals from "./components/Home/CustomSalesSignals.vue";
// News
import News from "./components/News/News.vue";
// Signals
import Signals from "./components/Signals/Signals.vue";
// Contacts
import Contact from "./components/Contact/Contact.vue";
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
    News,
    Signals,
    Contact,
    Analytics,
    AddToPlaylist
  }
};
</script>

<style></style>
