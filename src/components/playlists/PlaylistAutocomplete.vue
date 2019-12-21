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
      text
      hide-no-data
      hide-details
      label="Belongs to Playlist"
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
      select: { uid: this.playlistSelected, name: "" },
      playlists: []
    };
  },
  watch: {
    search(val) {
      if (this.playlists.length > 0) return;

      if (this.loading) return;

      this.queryPlaylists();
    },
    playlistSelected (val){
      console.log("playlistSelected store val change", val);
      this.select  = val;
    }
  },
  methods: {
    queryPlaylists() {
      this.loading = true;
      setTimeout(() => {
        this.$apollo
          .query({
            query: gql`
              query getFilteredPlaylists($playlistSearch: String) {
                playlists(first: 25, search: $playlistSearch) {
                  playlistsList{
                    uid
                    name
                  }
                }
              }
            `,
            variables: {
              playlistSearch: this.search ? this.search : ""
            },
            fetchPolicy: "no-cache"
          })
          .then(resp => {
            if (!!resp.data && !!resp.data.playlists) {
              this.playlists = resp.data.playlists.playlistsList;
            }
          });
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }, 500);
    },
    change(v) {
      let selectedPlaylist = this.playlists.filter(playlist => {
        if (v === playlist.uid){
          return playlist;
        }
      })[0];
      if (selectedPlaylist){
        this.$emit("change", { uid:selectedPlaylist.uid, name: selectedPlaylist.name });
      }
      
    }
  },
  computed: {
    playlistSelected (){
      return this.$store.state.advancedSearch.companySearch.playlist.uid;
    }
  },
  destroyed() {
    console.log("destroyed autocomplete");
  }
};
</script>