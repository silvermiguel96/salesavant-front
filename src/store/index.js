import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const defaultCompanySearch = {
  name: "",
  description: "",
  country: "",
  website: "",
  city: "",
  region: "",
  state: "",
  status: "",
  moreThanEmployees: -1,
  lessThanEmployees: 0,
  moreThanScore: -1,
  lessThanScore: 0
};

const defaultPlaylistSearch = {
  moreThanCompanies: -1,
  lessThanCompanies: 0,
  search: ""
};

const defaultSignalSearch = {
  search: "",
  group: "",
  category: ""
};

const state = {
  advancedSearch: {
    showDialog: false,
    searchType: null,
    companySearch: { ...defaultCompanySearch },
    playlistSearch: { ...defaultPlaylistSearch },
    signalSearch: { ...defaultSignalSearch },
    newsSearch: ""
  }
};

const getters = {};

const mutations = {
  showSearchDialog() {
    console.log("store showSearchDialog");
    state.advancedSearch.showDialog = true;
  },
  hideSearchDialog() {
    console.log("store hideSearchDialog");
    state.advancedSearch.showDialog = false;
  },
  resetAdvancedSearch() {
    state.advancedSearch = {
      showDialog: false,
      searchType: null,
      companySearch: { ...defaultCompanySearch },
      playlistSearch: { ...defaultPlaylistSearch },
      signalSearch: { ...defaultSignalSearch },
      newsSearch: ""
    };
  },
  doCompanySearch(state, companySearch) {
    console.log("store doCompanySearch");
    state.advancedSearch.searchType = "companies";
    state.advancedSearch.companySearch = companySearch;
    state.advancedSearch.showDialog = false;
  },
  doPlaylistsSearch(state, playlistSearch) {
    state.advancedSearch.searchType = "playlists";
    state.advancedSearch.playlistSearch = playlistSearch;
    state.advancedSearch.showDialog = false;
  },
  doSignalsSearch(state, signalSearch) {
    state.advancedSearch.searchType = "signals";
    state.advancedSearch.signalSearch = signalSearch;
  },
  doNewsSearch(state, newsSearch) {
    state.advancedSearch.searchType = "news";
    state.advancedSearch.newsSearch = newsSearch;
  }
};

const actions = {};

const debug = process.env.NODE_ENV !== "production";

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: debug
});

export default store;
