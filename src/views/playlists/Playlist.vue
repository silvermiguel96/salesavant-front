<template>
  <v-container fluid>
    <v-card>
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
            @click.prevent="$router.push(props.item.href)">
            {{ props.item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-tabs grow background-color="grey lighten-5" color="primary">
        <!-- Tab Companies -->
        <v-tab>Companies</v-tab>
        <v-tab-item>
          <companies />
        </v-tab-item>
        <!-- tab signals -->
        <v-tab>Signals</v-tab>
        <v-tab-item>
          <div>
            <h4>Coming soon</h4>
          </div>
        </v-tab-item>
        <!-- Tab contacts -->
        <v-tab>Contacts</v-tab>
        <v-tab-item>
          <div>
            <h4>Coming soon</h4>
          </div>
        </v-tab-item>
        <!-- Tab analytics -->
        <v-tab>Analytics</v-tab>
        <v-tab-item>
          <contact></contact>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
import _get from "lodash.get";
import gql from "graphql-tag";
import Companies from "./components/Companies.vue";
import { mapMutations } from "vuex";


export default {
  components: {
    Companies
  },
  data() {
    return {
      name: "",
      descending: false,
      page: 1,
      itemsPerPage: 10,
      sortBy: "",
      search: "",
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
    ...mapMutations(["updateCompanySearch"]),
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.page = page;
      this.itemsPerPage = itemsPerPage;
    },
    createJob(jobType) {
      this.$emit("createJob", {
        jobType: jobType,
        additionalData: {
          playlist_uid: this.playlist.uid,
          playlist_name: this.playlist.name
        }
      });
      this.$emit("showSnack", `Job ${jobType} enqueed successfully`, "success");
    }
  },
  beforeCreate() {
    this.$apollo.query.playlist;
  },
  mounted() {
    console.log(
      "playlist-companies update state ",
      this.$route.params.playlistUid
    );
    this.$store.commit("updateCompanySearch", {
      playlistUid: this.$route.params.playlistUid
    });
  }
};
</script>
