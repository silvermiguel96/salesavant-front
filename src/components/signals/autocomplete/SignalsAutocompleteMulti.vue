<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :item-value="'id'"
      :item-text="'name'"
      :search-input.sync="search"
      label="Select Signal"
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
        let groupStr = signal.group ? ` (${signal.group})` : "";
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
      if (this.loading) return;
      this.querySignals();
    }
  },
  methods: {
    querySignals() {
      this.loading = true;
      this.$apollo
        .query({
          query: gql`
            query getSignals($signalSearch: String) {
              signals(search: $signalSearch, first: 1000, offset: 0) {
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
            this.signals = resp.data.signals.signalsList.map(signal => {
              return {
                id: signal.id + ">>>" + signal.name,
                name: signal.name,
                group: signal.group
              };
            });
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    change(v) {
      if (v && v.length > 0) {
        let signals = [];
        let displaySignals = [];
        v.forEach(s => {
          let idSplit = s.split(">>>");
          signals.push(parseInt(idSplit[0]));
          displaySignals.push(idSplit[1]);
        });
        this.$emit("change", { signals, displaySignals });
        this.search = "";
      } else {
        this.$emit("change", {});
      }
    }
  }
};
</script>

<style>
.v-list--dense .v-list-item, .v-list-item--dense {
    min-height: 30px !important;
    max-height: 35px !important;
}
.v-list--dense .v-list-item, .v-list-item--dense {
  min-height: 30px !important;
  max-height: 32px !important;
}
.v-list-item--dense, .v-list--dense .v-list-item {
  min-height: 30px !important;
  max-height: 32px !important;
}
.v-list--dense .v-list-item .v-list-item__content, .v-list-item--dense .v-list-item__content {
  padding: 6px 0 !important;
}
</style>
