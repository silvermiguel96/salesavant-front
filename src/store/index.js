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
  playlist: {},
  signals: [],
  signalGroups: []
};

const state = {
  advancedSearch: {
    showDialog: false,
    searchType: null,
    companySearch: { ...defaultCompanySearch },
  }
};

const getters = {};

const mutations = {
  showSearchDialog() {
    state.advancedSearch.showDialog = true;
  },
  hideSearchDialog() {
    state.advancedSearch.showDialog = false;
  },
  resetAdvancedSearch() {
    state.advancedSearch = {
      showDialog: false,
      searchType: null,
      companySearch: { ...defaultCompanySearch }
    };
  },
  updateCompanySearch(state, newCompanySearch) {
    state.advancedSearch.companySearch = {
      ...state.advancedSearch.companySearch,
      ...newCompanySearch
    };
  },
  doCompanySearch(state, companySearch) {
    console.log(companySearch);
    state.advancedSearch.searchType = "companies";
    state.advancedSearch.companySearch = companySearch;
    state.advancedSearch.showDialog = false;
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
