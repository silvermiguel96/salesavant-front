<template>
  <v-list three-line subheader>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-sub-title>
          <v-form ref="newsSearchForm" @submit.prevent>
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <v-flex>
                  <v-text-field
                    name="news"
                    v-model="news"
                    label="Search in news"
                    @input="changeData"
                  ></v-text-field>
                </v-flex>
                <v-flex d-flex>
                  <v-btn @click="search" small class="text-capitalize" type="submit" color="primary">
                    <v-icon small>search</v-icon>
                    {{"news search"}}
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
      news: ""
    };
  },
  methods: {
    changeData(data) {
      this.$emit("change", { news: data });
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

