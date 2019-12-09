<template>
  <div>
    <v-form ref="playlistsSearchForm" @submit.prevent>
      <v-container grid-list-md text-xs-center>
        <v-layout>
          <v-flex>
            <v-text-field
              name="search"
              v-model="signalSearch.search"
              label="Signal name or description"
              autocomplete="off"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs6>
            <v-text-field 
              name="group" 
              v-model="signalSearch.group" 
              label="Group" 
              autocomplete="off"
              ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              name="category"
              v-model="signalSearch.category"
              label="Category"
              autocomplete="off"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex d-flex justify-center>
            <v-btn @click="search" class="text-capitalize" small type="submit" color="primary">
              <v-icon  class="pr-1" small>search</v-icon>
              {{"signals search"}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import gql from "graphql-tag";
import _get from "lodash.get";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      signalSearch: {
        search: "",
        group: "",
        category: ""
      }
    };
  },
  methods: {
    ...mapMutations([
      'doSignalsSearch'
    ]),
    search() {
      if (this.$route.path !== "/signals"){
        this.$router.push("/signals");
      }
      this.doSignalsSearch({...this.signalSearch});
    }
  }
};
</script>

