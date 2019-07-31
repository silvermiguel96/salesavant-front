<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :item-text="'name'"
      :item-value="'uid'"
      :items="playlists"
      :search-input.sync="search"
      cache-items
      flat
      hide-no-data
      hide-details
      label="Belongs to playlist"
      @change="change"
    ></v-autocomplete>
  </div>
</template>
<script>
import gql from "graphql-tag";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      loading: false,
      search: null,
      select: { uid: "", name: "" },
      playlists: []
    };
  },
  apollo: {
    // Query with parameters
    playlists: {
      // gql query
      query: gql`
        query getFilteredPlaylists($search: String) {
          playlists(first: 25, search: $search) {
            uid
            name
          }
        }
      `,
      variables() {
        return {
          search: this.search
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.queryPlaylists();
    }
  },
  methods: {
    queryPlaylists() {
      this.loading = true;
      setTimeout(() => {
        this.$apollo.queries.playlists;
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }, 500);
    },
    change(v = "") {
      this.$emit("change", { playlistUid: v });
    }
  }
};
</script>