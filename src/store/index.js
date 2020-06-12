import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const defaultCompanySearch = {
  name: "",
  description: "",
  country: "",
  website: "",
  links: "",
  city: "",
  region: "",
  state: "",
  status: "",
  moreThanEmployees: 0,
  lessThanEmployees: 0,
  moreThanScore: 0,
  lessThanScore: 0,
  playlistUid: "",
  displayPlaylistUid: ""
};

export const defaultContactSearch = {
  name: "",
  title: "",
  department: "",
  rank: "",
  city: "",
  state: "",
  region: "",
  country: "",
  status: "",
  moreThanScaleScoreAverage: 0,
  lessThanScaleScoreAverage: 0,
  moreThanCesa: 0,
  lessThanCesa: 0,
  moreThanWolfpackScore: 0,
  lessThanWolfpackScore: 0,
  moreThanNumberOfExits: 0,
  lessThanNumberOfExits: 0,
  playlistUid: "",
  displayPlaylistUid: ""
};

const state = {
  userEmail: null,
  jwtToken: null,
  steperConfig: 1,
  searchType: null,
  showSearchDialog: false,
  companySearch: {
    ...defaultCompanySearch
  },
  contactSearch: {
    ...defaultContactSearch
  },
};

const getters = {
  isLoggedIn: state => {
    return state.jwtToken ? true : false;
  }
};

const mutations = {
  showSearchDialog(state, newSearchType) {
    state.searchType = newSearchType;
    state.showSearchDialog = true;
  },
  updateCompanySearch(state, newCompanySearch) {
    state.companySearch = {
      ...defaultCompanySearch,
      ...newCompanySearch
    }
  },
  updateContactSearch(state, newContactSearch) {
    state.contactSearch = {
      ...defaultContactSearch,
      ...newContactSearch
    }
  },
  hideSearchDialog(state) {
    state.showSearchDialog = false;
  },
  resetCompanySearch(state) {
    state.companySearch = { ...defaultCompanySearch };
  },
  resetContactSearch(state) {
    state.contactSearch = { ...defaultContactSearch };
  },
  doCompanySearch(state, companySearch) {
    console.log(companySearch);
    state.searchType = "companies";
    state.showSearchDialog = false;
    state.companySearch = companySearch;

  },
  doContactSearch(state, contactSearch) {
    console.log(contactSearch);
    state.searchType = "contacts";
    state.showSearchDialog = false;
    state.contactSearch = contactSearch;
  },
  showDenseForm(state) {
    state.denseForm = false
  },
  nextStepper(state) {
    console.log("state.steperConfig", state.steperConfig)
    state.steperConfig = state.steperConfig + 1
    console.log("state.steperConfig next to", state.steperConfig)
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
