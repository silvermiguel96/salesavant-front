<template>
  <div>
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-form ref="playlistsSearchForm" @submit.prevent>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex>
            <v-text-field
              name="search"
              v-model="signal.search"
              label="Signal name or description"
              @input="changeData"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs6>
            <v-text-field
              name="group"
              v-model="signal.group"
              label="Group"
              @input="changeData"
            ></v-text-field>
          </v-flex>
                    <v-flex xs6>
            <v-text-field
              name="category"
              v-model="signal.category"
              label="Category"
              @input="changeData"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex>
            <v-btn @click="search" class="text-capitalize" small type="submit" color="primary">
              <v-icon small>search</v-icon>
              {{"Search signals"}}
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
export default {
  data() {
    return {
      signal: {
          search: "",
          group: "",
          category: ""
      },
      snack: false,
      snackColor: "",
      snackText: ""
    };
  },
  methods: {
    changeData(data) {
      this.$emit("change", { ...this.signal });
    },
    toggle() {
      this.$emit("toggle");
    },
    search() {
      this.toggle();
      this.$emit("search");
    }
  }
};
</script>

