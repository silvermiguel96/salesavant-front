<template>
    <v-dialog
      :value="value"
      max-width="530"
      hide-overlay
      transition="dialog-bottom-transition"
      @keydown.esc="$emit('hideSearch')"
      persistent
      scrollable>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="$emit('input')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Advanced Search</v-toolbar-title>
        </v-toolbar>
        <v-expansion-panels accordion :value="expand">

          <v-expansion-panel>
            <v-expansion-panel-header>Companies</v-expansion-panel-header>
            <v-expansion-panel-content>
              <companies-search
                @change="changeCompanySearchObject"
                @toggleSearch="toggleSearch"
                @search="onCompanySearch"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          
          <v-expansion-panel>
            <v-expansion-panel-header>Playlists</v-expansion-panel-header>
            <v-expansion-panel-content>
              <playlist-search
                @change="changePlaylists"
                @toggleSearch="toggleSearch"
                @search="onPlaylistsSearch"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>Signals</v-expansion-panel-header>
            <v-expansion-panel-content>
              <signals-search 
              @change="changeSignals"
              @toggleSearch="toggleSearch"
              @search="onSignalsSearch" />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>News</v-expansion-panel-header>
            <v-expansion-panel-content>
              <news-search 
              @change="changeNews" 
              @toggleSearch="toggleSearch" 
              @search="onNewsSearch" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-dialog>
</template>

<script>
import CompaniesSearch from "./CompaniesSearch.vue";
import NewsSearch from "./NewsSearch.vue";
import PlaylistSearch from "./PlaylistSearch.vue";
import SignalsSearch from "./SignalsSearch.vue";

const defaultCompanySearchObject = {
  name: "",
  description: "",
  country: "",
  website: "",
  city: "",
  region: "",
  state: "",
  status: "",
  lessThanEmployees: 0,
  moreThanEmployees: 0,
  moreThanScore: 0,
  lessThanScore: 0,
  playlistUid: "",
  signalId: 0
};

const defaultSignalsSearchObject = {
  search: "",
  group: "",
  category: ""
};

const defaultplaylistsSearchObject = {
  lessThanCompanies: 0,
  moreThanCompanies: 0,
  playlistsSearch: ""
};

export default {
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
      companySearchObject: { ...defaultCompanySearchObject },
      signalsSearchObject: { ...defaultSignalsSearchObject },
      searchType: null,
      news: "",
      playlistsSearchObject: { ...defaultplaylistsSearchObject }
    };
  },
  props: {
    value: { type: Boolean, default: false },
    expand: { type: Number, default: 0 }
  },
  components: {
    CompaniesSearch,
    NewsSearch,
    PlaylistSearch,
    SignalsSearch
  },
  methods: {
    toggleSearch() {
      this.$emit("toggleSearch", {});
    },
    search() {
      switch (this.searchType) {
        case "company":
          this.onCompanySearch();
          break;
        case "news":
          this.onNewsSearch();
          break;
        case "playlists":
          this.onPlaylistsSearch();
          break;
        case "signals":
          this.onSignalsSearch();
          break;
      }
    },
    changeCompanySearchObject(data) {
      this.searchType = "company";
      this.companySearchObject = { ...data };
    },
    changeNews(data) {
      this.searchType = "news";
      this.news = data.news;
    },
    changePlaylists(data) {
      this.searchType = "playlists";
      this.playlistsSearchObject = { ...data };
    },
    changeSignals(data) {
      this.searchType = "signals";
      this.signalsSearchObject = { ...data };
    },
    onCompanySearch() {
      this.$router.push({
        path: "/companies",
        query: { ...this.companySearchObject, searchType: "company" }
      });
    },
    onNewsSearch() {
      this.$router.push({
        path: "/news",
        query: { news: this.news, searchType: "news" }
      });
    },
    onPlaylistsSearch() {
      this.$router.push({
        path: "/playlists",
        query: { ...this.playlistsSearchObject, searchType: "playlists" }
      });
    },
    onSignalsSearch() {
      this.$router.push({
        path: "/signals",
        query: { ...this.signalsSearchObject, searchType: "signals" }
      });
    }
  }
};
</script>

<style scoped>
.v-dialog__content {
  justify-content: flex-end;
  height: unset;
  padding-top: 30px;
  margin-left: 16px;
}
</style>
