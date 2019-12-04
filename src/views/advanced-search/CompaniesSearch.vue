<template>
  <div>
    <v-form ref="simpleSearchForm" @submit.prevent>
      <v-container grid-list-xs text-xs-center>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field name="name" v-model="companySearch.name" label="Name"  autocomplete="off"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="country" v-model="companySearch.country" label="Country" autocomplete="off"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="description" label="Description" v-model="companySearch.description" autocomplete="off"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="city" v-model="companySearch.city" label="City" autocomplete="off"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="region" v-model="companySearch.region" label="Region" autocomplete="off"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="state" v-model="companySearch.state" label="State" autocomplete="off"></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="website" v-model="companySearch.website" label="Website Keywords" autocomplete="off" ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field name="status" v-model="companySearch.status" label="Status" autocomplete="off"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field
              name="moreThanEmployees"
              v-model="companySearch.moreThanEmployees"
              label="More than employees"
              autocomplete="off"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              name="lessThanEmployees"
              v-model="companySearch.lessThanEmployees"
              label="Less than employees"
              autocomplete="off"
            ></v-text-field>
          </v-flex>
          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field
                name="moreThanScore"
                v-model="companySearch.moreThanScore"
                label="More than score"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                name="lessThanScore"
                v-model="companySearch.lessThanScore"
                label="Less than score"
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
              {{"Companies Search"}}
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
import PlaylistsAutocomplete from "../../components/playlists/Autocomplete.vue";
import SignalsAutocomplete from "../../components/signals/Autocomplete.vue";
import SignalsGroupsAutocomplete from "../../components/signals/GroupsAutocomplete.vue";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      companySearch: {
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
      }
    };
  },
  methods: {
    ...mapMutations([
      'doCompanySearch'
    ]),
    search() {
      if (this.$route.path !== "/companies"){
        this.$router.push("/companies");
      }
      this.doCompanySearch({...this.companySearch})
    },
    onPlaylistAutocompleteChange(value) {
      this.company = { ...this.company, ...value };
    },
    onSignalsAutocompleteChange(value) {
      this.company = { ...this.company, signalId: _get(value, "signalId", "") };
    },
    onSignalsGroupAutocompleteChange(value) {
      this.company = { ...this.company, ...value };
    }
  },
  components: {
    PlaylistsAutocomplete,
    SignalsAutocomplete,
    SignalsGroupsAutocomplete
  },
};
</script>

