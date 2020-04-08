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
      <v-row>
        <v-col cols="12">
          <div class="title text--secondary pl-3 pl-sm-6">{{playlist.name}}</div>
          <div class="caption text--secondary pl-3 pl-sm-6">
            Last Updated:
            <span>{{ playlist.modificationTime | moment("from", "now") }}</span>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" xs="12" class="pt-0">
          <v-tabs grow background-color="grey lighten-5" color="primary">
            <!-- Tab Companies -->
            <v-tab class="text-capitalize">Companies</v-tab>
            <v-tab-item>
              <companies />
            </v-tab-item>
            <!-- Tab contacts -->
            <v-tab class="text-capitalize">Contacts</v-tab>
            <v-tab-item>
              <div>
                <contacts />
              </div>
            </v-tab-item>
            <!-- Tab analytics -->
            <v-tab class="text-capitalize">Analytics</v-tab>
            <v-tab-item>
              <analytics :aggs_data="additionalDataParsed"></analytics>
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
import Companies from "./CompaniesTab.vue";
import Contacts from "./ContactsTab.vue";
import Analytics from "./AnalyticsTab.vue";
import { mapMutations } from "vuex";

export default {
  components: {
    Companies,
    Analytics,
    Contacts
  },
  data() {
    return {
      isLoading: false,
      playlist: {
        uid: "",
        name: "",
        description: null
      }
    };
  },
  apollo: {
    playlist: {
      query: gql`
        query getPlaylist($uid: String) {
          playlist(uid: $uid) {
            uid
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
  methods: {
    ...mapMutations(["updateCompanySearch"])
  },
  computed: {
    additionalDataParsed: function() {
      if (!!this.playlist && !!this.playlist.additionalData) {
        return JSON.parse(this.playlist.additionalData);
      }
      return {};
    }
  },
  beforeCreate() {
    this.$apollo.query.playlist;
  },
  mounted() {
    this.$store.commit("updateCompanySearch", {
      playlistUid: this.$route.params.playlistUid
    });
  }
};
</script>
