<template>
  <v-layout row justify-center>
    <v-dialog
      v-model="show"
      max-width="530"
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
      scrollable
    >
      <v-card>
        <v-toolbar dark>
          <v-btn icon dark @click="toggle">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Search</v-toolbar-title>
        </v-toolbar>
        <v-expansion-panels accordion :value="expand">
          <v-expansion-panel>
            <v-expansion-panel-header>Companies</v-expansion-panel-header>
            <v-expansion-panel-content>
              <companies-search
                @change="changeCompanySearchObject"
                @toggle="toggle"
                @search="onCompanySearch"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>News</v-expansion-panel-header>
            <v-expansion-panel-content>
              <news-search @change="changeNews" @toggle="toggle" @search="onNewsSearch" />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>Playlists</v-expansion-panel-header>
            <v-expansion-panel-content>
              <playlist-search
                @change="changePlaylists"
                @toggle="toggle"
                @search="onPlaylistsSearch"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Signals</v-expansion-panel-header>
            <v-expansion-panel-content>
              <signals-search @change="changeSignals" @toggle="toggle" @search="onSignalsSearch" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-dialog>
  </v-layout>
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
      simpleSearch: "",
      companySearchObject: { ...defaultCompanySearchObject },
      signalsSearchObject: { ...defaultSignalsSearchObject },
      searchType: null,
      news: "",
      playlistsSearchObject: { ...defaultplaylistsSearchObject }
    };
  },
  props: {
    show: { type: Boolean, default: false },
    expand: { type: Number, default: 0 }
  },
  components: {
    CompaniesSearch,
    NewsSearch,
    PlaylistSearch,
    SignalsSearch
  },
  methods: {
    toggle() {
      this.$emit("toggle", { show: !this.$props.show });
    },
    search() {
      switch (this.searchType) {
        case "simple":
          this.onSimpleSearch();
          break;
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
    changeSimpleSearch(data) {
      this.searchType = "simple";
      this.simpleSearch = data.simpleSearch || "";
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
    onSimpleSearch() {
      this.toggle();
      this.$router.push({
        path: "/companies",
        query: {
          simpleSearch: this.simpleSearch,
          searchType: "simple"
        }
      });
    },
    onCompanySearch() {
      this.toggle();
      this.$router.push({
        path: "/companies",
        query: { ...this.companySearchObject, searchType: "company" }
      });
    },
    onNewsSearch() {
      this.toggle();
      this.$router.push({
        path: "/news",
        query: { news: this.news, searchType: "news" }
      });
    },
    onPlaylistsSearch() {
      this.toggle();
      this.$router.push({
        path: "/playlists",
        query: { ...this.playlistsSearchObject, searchType: "playlists" }
      });
    },
    onSignalsSearch() {
      this.toggle();
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
}
</style>
