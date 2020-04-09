<template>
  <div>
    <v-form ref="simpleSearchForm" @submit.prevent class="pt-2">
      <v-container fluid>
        <v-row wrap>
          <v-col cols="6">
            <v-text-field :dense="denseForm" name="name" v-model="companySearch.name" label="Name"  autocomplete="off"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field :dense="denseForm" name="country" v-model="companySearch.country" label="Country" autocomplete="off"></v-text-field>
          </v-col>
        </v-row>
        <v-row wrap>
          <v-col cols="6">
            <v-text-field :dense="denseForm" name="description" label="Description" v-model="companySearch.description" autocomplete="off"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field :dense="denseForm" name="region" v-model="companySearch.region" label="Region" autocomplete="off"></v-text-field>
          </v-col>
        </v-row>
        <v-row wrap>
          <v-col cols="6">
            <v-text-field :dense="denseForm" name="status" v-model="companySearch.status" label="Status" autocomplete="off"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field :dense="denseForm" name="state" v-model="companySearch.state" label="State" autocomplete="off"></v-text-field>
          </v-col>
        </v-row>
        <v-row wrap>
          <v-col cols="6">
            <v-text-field :dense="denseForm" name="website" v-model="companySearch.website" label="Website" autocomplete="off" ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field :dense="denseForm" name="city" v-model="companySearch.city" label="City" autocomplete="off"></v-text-field>
          </v-col>
        </v-row>
        <v-row wrap>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="moreThanEmployees"
              v-model="companySearch.moreThanEmployees"
              label="More Than Employees"
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="lessThanEmployees"
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
              v-model="companySearch.moreThanScore"
              label="More Than Score"
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="lessThanScore"
              v-model="companySearch.lessThanScore"
              label="Less Than Score"
              autocomplete="off"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row wrap>
          <v-col cols="12">
            <playlists-autocomplete :dense="denseForm" @change="onPlaylistAutocompleteChange" />
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
            <a @click.prevent="clearAll" class="text-capitalize body-2" block color="primary">
              clear all
            </a>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center align-center">
            <v-btn @click="search" class="text-capitalize" block type="submit" color="primary">
              <v-icon class="pr-1">search</v-icon>
              {{"Search"}}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import gql from "graphql-tag";
import _get from "lodash.get";
import PlaylistsAutocomplete from "../../components/playlists/PlaylistAutocomplete.vue";
import SignalsAutocompleteMulti from "../../components/signals/SignalsAutocompleteMulti.vue";
import SignalsGroupsAutocomplete from "../../components/signals/GroupsAutocomplete.vue";
import {defaultCompanySearch} from "../../store";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      companySearch: {...defaultCompanySearch},
      window: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    ...mapMutations([
      'updateCompanySearch',
      'doCompanySearch'
    ]),
    search() {
      if (this.$route.path !== "/companies"){
        this.$router.push("/companies");
      }
      if (!this.companySearch.moreThanEmployees) {
        this.companySearch.moreThanEmployees = 0
      }
      if (!this.companySearch.lessThanEmployees) {
        this.companySearch.lessThanEmployees = 0
      }
      if (!this.companySearch.moreThanScore) {
        this.companySearch.moreThanScore = 0
      }
      if (!this.companySearch.lessThanScore) {
        this.companySearch.lessThanScore = 0
      }
      console.log("this.companySearch", this.companySearch)
      this.doCompanySearch({...this.companySearch})
    },
    clearAll() {
      this.updateCompanySearch({ ...defaultCompanySearch})
      this.companySearch = {...defaultCompanySearch}
    },
    onPlaylistAutocompleteChange(value) {
      this.companySearch = {
        ...this.companySearch, 
        playlistUid: _get(value, "playlistUid", ""),
        displayPlaylistUid: _get(value, "displayPlaylistUid", "") 
      };
    },
    onSignalsAutocompleteChange(value) {
      this.companySearch = { 
        ...this.companySearch, 
        signals: _get(value, "signals", []),
        displaySignals: _get(value, "displaySignals", [])
      };
    },
    onSignalsGroupAutocompleteChange(value) {
      this.companySearch = { ...this.companySearch, signalGroups: _get(value, "signalGroups", [])};
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  },
  components: {
    PlaylistsAutocomplete,
    SignalsAutocompleteMulti,
    SignalsGroupsAutocomplete
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    denseForm() {
      return this.window.width > 1440 ? false : true;
    }
  }

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