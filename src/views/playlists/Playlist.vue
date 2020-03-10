<template>
  <v-container fluid>
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
    >
      <template v-slot:item="props">
        <v-breadcrumbs-item
          :href="props.item.href"
          :class="[props.item.disabled && 'disabled']"
          @click.prevent="$router.push(props.item.href)"
        >{{ props.item.text }}</v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-tabs grow background-color="grey lighten-5" color="primary">
      <!-- Tab Companies -->
      <v-tab>Companies</v-tab>
      <v-tab-item>
        <companies />
      </v-tab-item>
      <!-- Tab contacts -->
      <v-tab>Contacts</v-tab>
      <v-tab-item>
        <div>
          <contacts />
        </div>
      </v-tab-item>
      <!-- Tab analytics -->
      <v-tab>Analytics</v-tab>
      <v-tab-item>
        <analytics :aggs_data="additionalDataParsed">
        </analytics>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import _get from "lodash.get";
import gql from "graphql-tag";
import Companies from "./components/Companies.vue";
import Analytics from "./components/Analytics.vue";
import Contacts from "./components/Contact.vue"
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
        totalScore: 0,
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
            totalScore
            description
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
