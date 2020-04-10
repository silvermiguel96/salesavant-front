<template>
  <v-container fluid>
    <v-card>
      <v-row no-gutters>
        <v-col cols="12" xs="2" class="pt-0">
          <v-breadcrumbs
            :large="true"
            :items="[
            {
              text: 'Companies',
              disabled: false,
              href: '/companies'
            },
            {
              text: company.name || $route.params.companiesUid,
              disable: true
            }    
          ]"
            divider=">"
            class="pl-3 pl-sm-6 pb-0"
          >
            <template v-slot:item="props">
              <v-breadcrumbs-item
                :href="props.item.href"
                :class="[props.item.disabled && 'disabled']"
                @click.prevent="$router.push(props.item.href)"
              >{{ props.item.text }}</v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="9" lg="10">
          <div class="title text--secondary pl-3 pl-sm-6">
            {{ company.name || '' }}
            <small>
              <a
                v-if="company.url"
                :key="`news-external-link${company.url || ''}`"
                :href="httpCompany"
                target="_blank"
              >Website</a>
            </small>
          </div>
          <div class="caption text--secondary pl-3 pl-sm-6">
            Last Updated:
            <span>{{ company.modificationTime | moment("from", "now") }}</span>
          </div>
        </v-col>
        <v-col cols="12" sm="4" md="3" lg="2">
          <div class="pl-3 pl-sm-6">
            <v-icon color="blue" style="margin-top:-8px;">check_circle</v-icon>
            <span class="title text--secondary">Total Score:</span>
            <span class="title text--secondary">{{ company.totalScore || "--" }}</span>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" xs="12" class="pt-0">
          <v-tabs grow background-color="grey lighten-5" color="primary">
            <!-- Tab Home -->
            <v-tab class="text-capitalize">Summary</v-tab>
            <v-tab-item>
              <v-container fluid class="py-0">
                <v-row>
                  <v-col md="6" xs="12" class="px-0 py-0 pb-1 pr-sm-3 pb-sm-0">
                    <company-profile />
                  </v-col>
                  <v-col md="6" xs="12" class="px-0 py-0">
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
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
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
  },
  apollo: {
    company: {
      query: gql`
        query getCompany($companyUid: String) {
          company(uid: $companyUid) {
            uid
            name
            url
            description
            creationTime
            modificationTime
            totalScore
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  computed: {
    httpCompany: function() {
      return this.company.url.startsWith("http")
        ? this.company.url
        : `http://${this.company.url}`;
    }
  },
  beforeCreate() {
    this.$apollo.query.company;
  }
};
</script>
