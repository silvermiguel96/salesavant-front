<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :item-text="'name'"
      :item-value="'uid'"
      :items="playlists.playlistsList"
      :search-input.sync="search"
      cache-items
      text
      hide-no-data
      hide-details
      label="Belongs to playlist"
      @change="change"
      clearable
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
      search: "",
      select: { uid: "", name: "" },
      playlists: []
    };
  },
  apollo: {
    playlists: {
      query: gql`
        query getFilteredPlaylists($search: String) {
          playlists(first: 25, search: $search) {
            playlistsList{
              uid
              name
            }
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
      console.log("search val change", val);
      if (val && val !== this.select){
        this.queryPlaylists();
      }
    },
    playlistSelected (val){
      console.log("playlistSelected store val change", val);
      this.select  = val;
      this.$emit("change", { playlistUid: val });
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
    change(v) {
      this.$emit("change", { playlistUid: v });
    }
  },
  computed: {
      playlistSelected (){
        return this.$store.state.advancedSearch.companySearch.playlistUid;
      }
  },
  destroyed() {
    console.log("destroyed autocomplete");
  }
};
</script>