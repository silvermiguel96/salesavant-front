<template>
  <v-list three-line subheader>
    <v-subheader>Companies simple Search</v-subheader>
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Name or description</v-list-tile-title>
        <v-list-tile-sub-title>
          <v-form ref="simpleSearchForm">
            <v-text-field v-model="simpleSearch" label="name or description" @input="changeData"></v-text-field>
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
    }
  }
};
</script>

