<template>
  <div>
    <v-form ref="simpleSearchForm" @submit.prevent class="pt-2">
      <v-container fluid>
        <v-row wrap>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="name"
              v-model="contactSearch.name"
              label="Name"
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="title"
              v-model="contactSearch.title"
              label="title"
              autocomplete="off"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row wrap>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="department"
              label="Department"
              v-model="contactSearch.department"
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="rank"
              v-model="contactSearch.rank"
              label="Rank"
              autocomplete="off"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row wrap>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="city"
              v-model="contactSearch.city"
              label="City"
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="state"
              v-model="contactSearch.state"
              label="State"
              autocomplete="off"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row wrap>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="region"
              v-model="contactSearch.region"
              label="Region"
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="country"
              v-model="contactSearch.country"
              label="Country"
              autocomplete="off"
            ></v-text-field>
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
              name="moreThanScaleScoreAverage"
              v-model="contactSearch.moreThanScaleScoreAverage"
              label="More Than Than Scale Score Avg."
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="lessThanScaleScoreAverage"
              v-model="contactSearch.lessThanScaleScoreAverage"
              label="Less Than Scale Score Avg."
              autocomplete="off"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row wrap>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="moreThanCesa"
              v-model="contactSearch.moreThanCesa"
              label="More Than Capital Efficiency Score Avg."
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="lessThanCesa"
              v-model="contactSearch.lessThanCesa"
              label="Less Than Capital Efficiency Score Avg."
              autocomplete="off"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row wrap>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="moreThanWolfpackScore"
              v-model="contactSearch.moreThanWolfpackScore"
              label="More Than Wolfpack Score"
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="lessThanWolfpackScore"
              v-model="contactSearch.lessThanWolfpackScore"
              label="Less Than Wolfpack Score"
              autocomplete="off"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row wrap>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="moreThanNumberOfExits"
              v-model="contactSearch.moreThanNumberOfExits"
              label="More Than Number Of Exits"
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :dense="denseForm"
              name="lessThanNumberOfExits"
              v-model="contactSearch.lessThanNumberOfExits"
              label="Less Than Number Of Exits"
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
        <v-divider></v-divider>
        <v-row wrap>
          <v-col cols="12" md="6" class="d-flex justify-start align-center">
            <a
              @click.prevent="clearAll"
              class="text-capitalize body-2"
              block
              color="primary"
            >clear all</a>
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
import { defaultContactSearch } from "../../store";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      contactSearch: { ...defaultContactSearch },
      window: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    ...mapMutations(["updateCompanySearch", "doCompanySearch"]),
    search() {
      if (this.$route.path !== "/companies") {
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
      console.log("this.company", this.companySearch);
      this.doCompanySearch({ ...this.companySearch });
    },
    clearAll() {
      this.updateCompanySearch({ ...defaultCompanySearch });
      this.companySearch = { ...defaultCompanySearch };
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
      this.companySearch = {
        ...this.companySearch,
        signalGroups: _get(value, "signalGroups", [])
      };
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  },
  components: {
    PlaylistsAutocomplete,
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