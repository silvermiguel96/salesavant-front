<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :item-text="'name'"
      :item-value="'id'"
      :items="signals.signalsList"
      :search-input.sync="search"
      cache-items
      text
      hide-no-data
      hide-details
      :label="placeholder"
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
      select: { id: "", name: "" },
      signals: []
    };
  },
  props: {
    placeholder: { type: String, default: "Is in signal" }
  },
  apollo: {
    signals: {
      query: gql`
        query getFilteredSignals($search: String) {
          signals(first: 25, search: $search) {
            signalsList {
              id
              name
            }
          }
        }
      `,
      variables() {
        return {
          search: this.search
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySignals();
    }
  },
  methods: {
    querySignals() {
      this.loading = true;
      setTimeout(() => {
        this.$apollo.queries.signals;
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }, 500);
    },
    change(v = "") {
      this.$emit("change", { signalId: v });
    }
  }
};
</script>
