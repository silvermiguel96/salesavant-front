<template>
  <v-form ref="newsSearchForm" @submit.prevent>
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex>
          <v-text-field name="news" v-model="news" label="Search in news" @input="changeData"></v-text-field>
        </v-flex>
        <v-flex d-flex align-center justify-center>
          <v-btn @click="search" small class="text-capitalize" type="submit" color="primary">
            <v-icon class="pr-1" small>search</v-icon>
            {{"news search"}}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
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

