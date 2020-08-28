<template>
  <v-form ref="simpleSearchForm" @submit.prevent>
    <v-row wrap>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="name"
          id="field-company-name"
          v-model="companySearch.name"
          label="Name"
          autocomplete="off"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="description"
          id="field-company-description"
          v-model="companySearch.description"
          label="Description"
          autocomplete="off"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row wrap>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="country"
          id="field-company-country"
          v-model="companySearch.country"
          label="Country"
          autocomplete="off"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="region"
          id="field-company-region"
          v-model="companySearch.region"
          label="Region"
          autocomplete="off"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row wrap>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="city"
          id="field-company-city"
          v-model="companySearch.city"
          label="City"
          autocomplete="off"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="state"
          id="field-company-state"
          v-model="companySearch.state"
          label="State"
          autocomplete="off"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row wrap>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="website"
          id="field-company-website"
          v-model="companySearch.website"
          label="Website keywords"
          autocomplete="off"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="links"
          id="field-company-links"
          v-model="companySearch.links"
          label="Links"
          autocomplete="off"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row wrap>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="industry"
          id="field-company-industry"
          v-model="companySearch.industry"
          label="Industry"
          autocomplete="off"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="naics"
          id="field-company-naics"
          v-model="companySearch.naics"
          label="NAICS"
          autocomplete="off"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row wrap>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="moreThanEmployees"
          id="field-company-moreThanEmployees"
          v-model="companySearch.moreThanEmployees"
          label="More Than Employees"
          autocomplete="off"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="lessThanEmployees"
          id="field-company-lessThanEmployees"
          v-model="companySearch.lessThanEmployees"
          label="Less Than Employees"
          autocomplete="off"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row wrap>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="moreThanScore"
          id="field-company-moreThanScore"
          v-model="companySearch.moreThanScore"
          label="More Than Score"
          autocomplete="off"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="lessThanScore"
          id="field-company-lessThanScore"
          v-model="companySearch.moreThanScore"
          label="Less Than Score"
          autocomplete="off"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row wrap>
      <v-col cols="6">
        <v-text-field
          :dense="denseForm"
          name="status"
          id="field-company-status"
          v-model="companySearch.status"
          label="Status"
          autocomplete="off"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row wrap class="pt-2">
      <v-col cols="12">
        <playlists-autocomplete
          :dense="denseForm"
          playlistType="company"
          @change="onPlaylistAutocompleteChange"
        />
      </v-col>
    </v-row>
    <v-row wrap>
      <v-col cols="12">
        <signals-autocomplete-multi :dense="denseForm" @change="onSignalsAutocompleteChange" />
      </v-col>
    </v-row>
    <v-row wrap>
      <v-col cols="12">
        <signals-groups-autocomplete :dense="denseForm" @change="onSignalsGroupAutocompleteChange" />
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row wrap>
      <v-col cols="12" md="6" class="d-flex justify-start align-center">
        <a
          @click.prevent="clearAll"
          class="text-capitalize body-2"
          block
          small
          color="primary"
        >clear all</a>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-center align-center">
        <v-btn id="button-search-company" @click="search" class="text-capitalize" block type="submit" color="primary">
          <v-icon small class="pr-1">search</v-icon>
          {{"Search"}}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { setTimeout } from "timers";
import gql from "graphql-tag";
import _get from "lodash.get";
import PlaylistsAutocomplete from "../playlists/PlaylistAutocomplete.vue";
import SignalsGroupsAutocomplete from "../signals/autocomplete/GroupsAutocomplete.vue";
import SignalsAutocompleteMulti from "../signals/autocomplete/SignalsAutocompleteMulti.vue";
import SignalsAutocomplete from "../signals/autocomplete/SignalsAutocomplete.vue";
import { defaultCompanySearch } from "../../store";
import { mapMutations } from "vuex";

export default {
  components: {
    PlaylistsAutocomplete,
    SignalsAutocompleteMulti,
    SignalsGroupsAutocomplete,
  },
  data() {
    return {
      companySearch: { ...defaultCompanySearch },
      window: {
        width: 0,
        height: 0,
      },
    };
  },

  methods: {
    ...mapMutations(["resetCompanySearch", "doCompanySearch"]),
    search() {
      if (!this.$route.path.startsWith("/companies")) {
        this.$router.push("/companies");
      }
      if (!this.companySearch.moreThanEmployees) {
        this.companySearch.moreThanEmployees = 0;
      }
      if (!this.companySearch.lessThanEmployees) {
        this.companySearch.lessThanEmployees = 0;
      }
      if (!this.companySearch.moreThanScore) {
        this.companySearch.moreThanScore = 0;
      }
      if (!this.companySearch.lessThanScore) {
        this.companySearch.lessThanScore = 0;
      }
      console.log("this.companySearch", this.companySearch);
      this.doCompanySearch({ ...this.companySearch });
    },
    clearAll() {
      this.resetCompanySearch();
      this.companySearch = { ...defaultCompanySearch };
    },
    onPlaylistAutocompleteChange(value) {
      this.companySearch = {
        ...this.companySearch,
        playlistUid: _get(value, "playlistUid", ""),
        displayPlaylistUid: _get(value, "displayPlaylistUid", ""),
      };
    },
    onSignalsAutocompleteChange(value) {
      this.companySearch = {
        ...this.companySearch,
        signals: _get(value, "signals", []),
        displaySignals: _get(value, "displaySignals", []),
      };
    },
    onSignalsGroupAutocompleteChange(value) {
      this.companySearch = {
        ...this.companySearch,
        signalGroups: _get(value, "signalGroups", []),
      };
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  computed: {
    denseForm() {
      return this.window.width > 1440 ? false : true;
    },
    // playlistUid() {
    //   return this.$store.state.companySearch.playlistUid
    // }
  },
};
</script>

<style scoped>
.col-6 {
  padding: 0px 12px !important;
}
.col-12 {
  padding: 8px 12px !important;
}
</style>