<template>
  <div>
    <v-form ref="simpleSearchForm" @submit.prevent>
      <v-container grid-list-xs text-xs-center>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field name="name" v-model="company.name" label="Name"  @input="changeData" autocomplete="off"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="country" v-model="company.country" label="Country" @input="changeData" autocomplete="off"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="description" label="Description" v-model="company.description" @input="changeData" autocomplete="off"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="city" v-model="company.city" label="City" @input="changeData" autocomplete="off"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="region" v-model="company.region" label="Region" @input="changeData" autocomplete="off"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="state" v-model="company.state" label="State" @input="changeData" autocomplete="off"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="website" v-model="company.website" label="Website Keywords" @input="changeData" autocomplete="off" ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="status" v-model="company.status" label="Status" @input="changeData" autocomplete="off"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field
              name="moreThanEmployees"
              v-model="company.moreThanEmployees"
              label="More than employees"
              @input="changeData"
              autocomplete="off"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              name="lessThanEmployees"
              v-model="company.lessThanEmployees"
              label="Less than employees"
              @input="changeData"
              autocomplete="off"
            ></v-text-field>
          </v-flex>
          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field
                name="moreThanScore"
                v-model="company.moreThanScore"
                label="More than score"
                @input="changeData"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                name="lessThanScore"
                v-model="company.lessThanScore"
                label="Less than score"
                @input="changeData"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <signals-groups-autocomplete @change="onSignalsGroupAutocompleteChange" />
          </v-flex>
          <v-flex xs6>
            <signals-autocomplete @change="onSignalsAutocompleteChange" />
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <playlists-autocomplete @change="onPlaylistAutocompleteChange" />
          </v-flex>
          <v-flex  d-flex align-end justify-center >
            <v-btn @click="search" small class="text-capitalize" type="submit" color="primary">
              <v-icon class="pr-1" small>search</v-icon>
              {{" Companies Search"}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import gql from "graphql-tag";
import _get from "lodash.get";
import PlaylistsAutocomplete from "../playlists/Autocomplete.vue";
import SignalsAutocomplete from "../signals/Autocomplete.vue";
import SignalsGroupsAutocomplete from "../signals/GroupsAutocomplete.vue";
export default {
  data() {
    return {
      company: {
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
        signalId: 0,
        signalGroup: ""
      },
      snack: false,
      snackColor: "",
      snackText: "",
      newPlaylistName: "",
      showNewPlaylistName: false
    };
  },
  components: {
    PlaylistsAutocomplete,
    SignalsAutocomplete,
    SignalsGroupsAutocomplete
  },
  methods: {
    changeData() {
      this.$emit("change", { ...this.company });
    },
    toggleSearch() {
      this.$emit("toggleSearch");
    },
    search() {
      this.toggleSearch();
      this.$emit("search");
    },
    onPlaylistAutocompleteChange(value) {
      this.company = { ...this.company, ...value };
      this.changeData();
    },
    onSignalsAutocompleteChange(value) {
      this.company = { ...this.company, signalId: _get(value, "signalId", "") };
      this.changeData();
    },
    onSignalsGroupAutocompleteChange(value) {
      this.company = { ...this.company, ...value };
      this.changeData();
    }
  }
};
</script>

