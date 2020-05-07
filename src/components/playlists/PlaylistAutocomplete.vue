<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :item-text="'name'"
      :item-value="'uid'"
      :items="playlists"
      :search-input.sync="search"
      label="Select Playlist"
      @change="change"
      cache-items
      text
      dense
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
      if (this.loading) return;
      this.queryPlaylists();
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
                playlists(first: 1000, search: $playlistSearch) {
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
  destroyed() {
    console.log("destroyed autocomplete");
  }
};
</script>

<style scoped>
.v-list-item--dense, .v-list--dense .v-list-item {
  min-height: 20px !important;
}
.v-list--dense .v-list-item .v-list-item__content, .v-list-item--dense .v-list-item__content {
  padding: 6px 0;
}
</style>
