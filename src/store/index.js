import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const defaultCompanySearch = {
  name: "",
  description: "",
  country: "",
  website: "",
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
  showSearchDialog(state) {
    state.showSearchDialog = true;
  },
  hideSearchDialog(state) {
    state.showSearchDialog = false;
  },
  resetCompanySearch(state) {
    state = {
      ...state,
      companySearch: { ...defaultCompanySearch }
    };
  },
  resetContactSearch(state) {
    state = {
      ...state,
      contactSearch: { ...defaultContactSearch }
    };
  },
  updateCompanySearch(state, newCompanySearch) {
    state.companySearch = {
      ...state.companySearch,
      ...newCompanySearch
    };
  },
  doCompanySearch(state, companySearch) {
    console.log(companySearch);
    state.searchType = "companies";
    state.companySearch = companySearch;
    state.companySearch.showDialog = false;
  },
  updateContactSearch(state, newContactSearch) {
    state.contactSearch = {
      ...state.contactSearch,
      ...newContactSearch
    };
  },
  doContactSearch(state, contactSearch) {
    console.log(contactSearch);
    state.searchType = "contacts";
    state.contactSearch = contactSearch;
    state.contactSearch.showDialog = false;
  },
  showDenseForm(state) {
    state.denseForm = false
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
