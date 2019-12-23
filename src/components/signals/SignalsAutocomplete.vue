<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :item-value="'id'"
      :item-text="'name'"
      :search-input.sync="search"
      label="Has Signal"
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
      signals: [],
      select: [],
      nameLimit: 30
    };
  },
  computed: {
    items() {
      return this.signals.map(signal => {
        let groupStr = signal.group ? ` (${signal.group})`: "";
        let name =
          signal.name.length > this.nameLimit
            ? signal.name.slice(0, this.nameLimit) + "..." + groupStr
            : signal.name + groupStr;
        return Object.assign({}, signal, { name });
      });
    }
  },
  watch: {
    search(val) {
      if (this.signals.length > 0) return;

      if (this.loading) return;

      this.querySignals();
    }
  },
  methods: {
    querySignals() {
      this.loading = true;
      setTimeout(() => {
        this.$apollo
          .query({
            query: gql`
              query getSignals($signalSearch: String) {
                signals(first: 25, search: $signalSearch) {
                  signalsList {
                    id
                    name
                    group
                  }
                }
              }
            `,
            variables: {
              signalSearch: this.search ? this.search : ""
            },
            fetchPolicy: "no-cache"
          })
          .then(resp => {
            if (!!resp.data && !!resp.data.signals) {
              this.signals = resp.data.signals.signalsList.map(signal =>{
                return {
                  id: signal.id + ">>>" + signal.name, 
                  name: signal.name,
                  group: signal.group
                };
              });
            }
          });
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }, 500);
    },
    change(v) {
      if (v && v.length>0){
        let signals = [];
        let displaySignals = [];
        v.forEach(s => {
          let idSplit = s.split(">>>");
          signals.push(parseInt(idSplit[0]));
          displaySignals.push(idSplit[1]);
        });
        this.$emit("change", { signals, displaySignals });
      }
    }
  }
};
</script>
