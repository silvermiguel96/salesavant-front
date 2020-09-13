<template>
  <v-container fluid>
    <v-card>
      <v-row no-gutters>
        <v-col cols="12" xs="12" class="pt-0">
          <v-breadcrumbs
            :large="true"
            :items="[
            {
              text: 'Playlists',
              disabled: false,
              href: '/playlists'
            },
            {
              text: playlist.name || $route.params.playlistUid,
              disabled: true
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
      <v-row no-gutters>
        <v-col cols="12">
          <div class="caption text--secondary pl-3 pl-sm-6">
            Last Updated:
            <span>{{ playlist.modificationTime | moment("from", "now") }}</span>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-md-2"> 
        <v-col cols="12" xs="12" class="pt-0" v-if="playlist">
          <v-tabs grow background-color="grey lighten-5" color="primary" v-if="playlist.playlistType=='company'">
            <!-- Tab Companies -->
            <v-tab class="text-capitalize">Companies</v-tab>
            <v-tab-item>
              <company-companies/>
            </v-tab-item>
            <!-- Tab Comments -->
            <v-tab class="text-capitalize">Comments</v-tab>
            <v-tab-item>
              <company-comments/>
            </v-tab-item>
            <!-- Tab contacts -->
            <v-tab class="text-capitalize">Contacts</v-tab>
            <v-tab-item>
                <company-contacts />
            </v-tab-item>
            <!-- Tab analytics -->
            <v-tab class="text-capitalize">Analytics</v-tab>
            <v-tab-item>
              <company-analytics :aggs_data="additionalDataParsed" />
            </v-tab-item>
          </v-tabs>
          <v-tabs grow background-color="grey lighten-5" color="primary" v-if="playlist.playlistType=='contact'">
            <!-- Tab contacts -->
            <v-tab class="text-capitalize">Contacts</v-tab>
            <v-tab-item>
                <contact-contacts />
            </v-tab-item>
            <!-- Tab Companies -->
            <v-tab class="text-capitalize">Companies</v-tab>
            <v-tab-item>
              <contact-companies />
            </v-tab-item>
            <!-- Tab analytics -->
            <v-tab class="text-capitalize">Analytics</v-tab>
            <v-tab-item>
              <contact-analytics :aggs_data="additionalDataParsed"/>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import _get from "lodash.get";
import gql from "graphql-tag";
import CompanyCompanies from "../../components/playlists/playlist/company/Companies.vue";
import CompanyComments from "../../components/playlists/playlist/company/Comments.vue";
import CompanyContacts from "../../components/playlists/playlist/company/Contacts.vue";
import CompanyAnalytics from "../../components/playlists/playlist/company/Analytics.vue";
import ContactContacts from "../../components/playlists/playlist/contact/Contacts.vue";
import ContactCompanies from "../../components/playlists/playlist/contact/Companies.vue";
import ContactAnalytics from "../../components/playlists/playlist/contact/Analytics.vue";

export default {
  components: {
    CompanyCompanies,
    CompanyComments,
    CompanyContacts,
    CompanyAnalytics,
    ContactContacts,
    ContactCompanies,
    ContactAnalytics
  },
  data() {
    return {
      isLoading: false,
      playlist: {
      }
    };
  },
  apollo: {
    playlist: {
      query: gql`
        query playlist($uid: String) {
          playlist(uid: $uid) {
            uid
            playlistType
            name
            description
            modificationTime
            additionalData
          }
        }
      `,
      variables() {
        return {
          uid: this.$route.params.playlistUid
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  computed: {
    additionalDataParsed: function() {
      if (!!this.playlist && !!this.playlist.additionalData) {
        return JSON.parse(this.playlist.additionalData);
      }
      return {};
    }
  },
  // mounted() {
  //   this.$store.commit("updateCompanySearch", {
  //     playlistUid: this.$route.params.playlistUid
  //   });
  // }
};
</script>
