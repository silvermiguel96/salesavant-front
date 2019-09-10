<template>
  <v-form>
    <v-container>
      <v-layout wrap>
        <v-flex xs12>
          <v-autocomplete
            v-model="selectedPlaylists"
            :disabled="isUpdating"
            :items="playlists"
            chips
            color="blue-grey lighten-2"
            label="Select"
            item-text="name"
            item-value="uid"
            multiple
            :search-input.sync="search"
            cache-items
            text
            @change="change"
          >
            <template v-slot:selection="data">
              <v-chip
                :selected="data.selected"
                close
                class="chip--select-multi"
                @input="remove(data.item)"
              >{{ data.item.name }}</v-chip>
            </template>
            <template v-slot:item="data">
              <template v-if="typeof data.item !== 'object'">
                <v-list-tile-content v-text="data.item"></v-list-tile-content>
              </template>
              <template v-else>
                <v-list-tile-content>
                  <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="data.item.group"></v-list-tile-sub-title>
                </v-list-tile-content>
              </template>
            </template>
          </v-autocomplete>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>
<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      search: "",
      autoUpdate: true,
      selectedPlaylists: [],
      isUpdating: false,
      playlists: []
    };
  },
  apollo: {
    playlists: {
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
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000);
      }
    },
    search(val) {
      val && val !== this.select && this.queryPlaylists();
    }
  },
  methods: {
    remove(item) {
      const index = this.selectedPlaylists.indexOf(item.uid);
      if (index >= 0) this.selectedPlaylists.splice(index, 1);
    },
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
    },
    change() {
      this.$emit("change", { selectedPlaylists: this.selectedPlaylists });
    }
  }
};
</script>