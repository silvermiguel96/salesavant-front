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
      autocomplete="off"
      @change="change"
      cache-items
      hide-no-data
      hide-details
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
      signals:[],
      select: "",
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
      this.$emit("onSearch", {
        currentSignalSearch: val
      });

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
              signals(first: 10, search: $signalSearch) {
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
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    change(v) {
      if (v && v.length>0){
        let idSplit = v.split(">>>");
        this.$emit("change", { signalId: parseInt(idSplit[0]) });
        this.search = "";
      }else{
        this.$emit("change", {});  
      }
    }
  }
};
</script>
