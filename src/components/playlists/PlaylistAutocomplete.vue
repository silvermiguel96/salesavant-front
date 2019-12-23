<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :item-text="'name'"
      :item-value="'uid'"
      :items="playlists"
      :search-input.sync="search"
      label="Belongs to Playlist"
      @change="change"
      cache-items
      text
      hide-no-data
      hide-details
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
      select: "",
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
              this.playlists = resp.data.playlists.playlistsList.map(playlist=>{
                return {
                  uid: playlist.uid + ">>>" + playlist.name,
                  name: playlist.name
                }
              });
            }
          });
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }, 500);
    },
    change(v) {
      if (v && v.length>0){
        let idSplit = v.split(">>>");
        this.$emit("change", { 
          playlistUid: idSplit[0], 
          displayPlaylistUid: idSplit[1] 
        });  
      }else{
        this.$emit("change", {});
      }
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