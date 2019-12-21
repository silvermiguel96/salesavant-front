<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :item-text="'group'"
      :item-value="'group'"
      :items="signalsGroup"
      label="Has Signal Group"
      @change="change"
      outlined
      cache-items
      dense
      chips
      small-chips
      deletable-chips
      multiple
      hide-no-data
      hide-details
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
      signalsGroup: []
    };
  },
  apollo: {
    signalsGroupAggs: {
      query: gql`
        query getAllSignalsGroups($first: Int) {
          companySignalsGroupAggs(first: $first) {
            group
          }
        }
      `,
      variables() {
        return {
          first: 1000
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  methods: {
    change(v = "") {
      this.$emit("change", { signalGroups: v });
    }
  },
  beforeCreate() {
    this.$apollo.queries.signalsGroupAggs;
  }
};
</script>