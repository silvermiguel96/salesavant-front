<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      label="Select Signal Group"
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
      signalGroups: [],
      select: [],
      nameLimit: 30
    };
  },
  computed: {
    items() {
      return this.signalGroups.map(sg => {
        return sg.length > this.nameLimit
          ? sg.slice(0, this.nameLimit) + "..."
          : sg;
      });
    }
  },
  watch: {
    search(val) {
      if (this.loading) return;
      this.querySignalGroups();
    }
  },
  methods: {
    querySignalGroups() {
      this.loading = true;
      this.$apollo
        .query({
          query: gql`
            query getSignals($signalGroupSearch: String) {
              signals(first: 15, searchGroup: $signalGroupSearch) {
                signalsList {
                  id
                  name
                  group
                }
              }
            }
          `,
          variables: {
            signalGroupSearch: this.search ? this.search : ""
          },
          fetchPolicy: "no-cache"
        })
        .then(resp => {
          if (!!resp.data && !!resp.data.signals) {
            let signalGroups = resp.data.signals.signalsList
              .filter(signal =>{
                if (signal.group){
                  return true;
                }
              })
              .map(signal =>{
                return signal.group;
              });
            this.signalGroups = Array.from(new Set(signalGroups));
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    change(v) {
      this.$emit("change", { signalGroups: v });
      this.search = "";
    }
  },
  beforeCreate() {
    this.$apollo.queries.signalsGroupAggs;
  }
};
</script>