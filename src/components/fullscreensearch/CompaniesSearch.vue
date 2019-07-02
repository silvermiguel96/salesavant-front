<template>
  <v-list three-line subheader>
    <v-subheader>Companies Search</v-subheader>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-sub-title>
          <v-form ref="simpleSearchForm" @submit.prevent>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <v-flex>
                  <v-text-field
                    name="simpleSearch"
                    v-model="simpleSearch"
                    label="name or description"
                    @input="changeData"
                  ></v-text-field>
                </v-flex>
                <v-flex>
                  <v-btn @click="search" type="submit" color="primary">
                    <v-icon>search</v-icon>
                    {{" Search"}}
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  data() {
    return {
      simpleSearch: ""
    };
  },
  methods: {
    changeData(data) {
      this.$emit("change", { simpleSearch: data });
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

