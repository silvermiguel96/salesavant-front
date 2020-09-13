import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const defaultCompanySearch = {
  name: "",
  description: "",
  website: "",
  links: "",
  industry: "",
  naics: "",
  city: "",
  region: "",
  state: "",
  country: "",
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

export const defaultSalesforceWizard = {
  step: 1,
  connectionId: null,
  connectionName: null,
  salesforceCode: null
};

const state = {
  userEmail: null,
  jwtToken: null,
  searchType: null,
  showSearch: false,
  showSearchDialog: false,
  companySearch: {
    ...defaultCompanySearch
  },
  contactSearch: {
    ...defaultContactSearch
  },
  salesforceWizard: {
    ...defaultSalesforceWizard
  }
};

const getters = {
  isLoggedIn: state => {
    return state.jwtToken ? true : false;
  }
};

const mutations = {
  showSearch(state) {
    state.showSearch = true;
  },
  hideSearch(state) {
    state.showSearch = false;
  },
  showSearchDialog(state, newSearchType) {
    state.searchType = newSearchType;
    state.showSearch = true;
    state.showSearchDialog = true;
  },
  hideSearchDialog(state) {
    state.showSearchDialog = false;
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
  resetSalesforceWizardConf(state) {
    state.salesforceWizard = defaultSalesforceWizard;
  },
  updateSalesforceWizardConf(state, payload) {
    state.salesforceWizard = { ...state.salesforceWizard, ...payload }
  },
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
