<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :item-text="'group'"
      :item-value="'group'"
      :items="signalsGroupAggs"
      cache-items
      flat
      hide-no-data
      hide-details
      label="In signal Group"
      @change="change"
      clearable
    ></v-autocomplete>
  </div>
</template>
<script>
import gql from "graphql-tag";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      loading: false,
      search: "",
      select: null,
      signalsGroupAggs: []
    };
  },
  apollo: {
    signalsGroupAggs: {
      query: gql`
        query getAllSignalsGroups($first: Int) {
          signalsGroupAggs(first: $first) {
            group
          }
        }
      `,
      variables() {
        return {
          first: 1000000000
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  methods: {
    change(v = "") {
      this.$emit("change", { signalGroup: v });
    }
  },
  beforeCreate() {
    this.$apollo.queries.signalsGroupAggs;
  }
};
</script>