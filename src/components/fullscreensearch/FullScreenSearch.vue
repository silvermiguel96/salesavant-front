<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="toggle">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Search</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn @click="search">
              <v-icon>search</v-icon>
              {{" Search"}}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <simple-search @change="changeSimpleSearch" @toggle="toggle" @search="search" />
        <v-divider></v-divider>
        <companies-search @change="changeCompanySearchObject" @toggle="toggle" @search="search" />
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import SimpleSearch from "./SimpleSearch.vue";
import CompaniesSearch from "./CompaniesSearch.vue";

const defaultCompanySearchObject = {
  name: "",
  description: ""
};

export default {
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
      simpleSearch: "",
      companySearchObject: { ...defaultCompanySearchObject },
      searchType: null
    };
  },
  props: {
    show: { type: Boolean, default: false }
  },
  components: {
    SimpleSearch,
    CompaniesSearch
  },
  methods: {
    toggle() {
      this.$emit("toggle", { show: !this.$props.show });
    },
    search() {
      switch (this.searchType) {
        case "simple":
          this.toggle();
          this.onSimpleSearch();
          break;
        case "company":
          this.toggle();
          this.onCompanySearch();
          break;
      }
    },
    changeSimpleSearch(data) {
      this.searchType = "simple";
      this.simpleSearch = data.simpleSearch || "";
    },
    changeCompanySearchObject(data) {
      this.searchType = "company";
      this.companySearchObject = { ...data };
    },
    onSimpleSearch() {
      this.$router.push({
        path: "/companies",
        query: {
          simpleSearch: this.simpleSearch,
          searchType: this.searchType
        }
      });
    },
    onCompanySearch() {
      this.$router.push({
        path: "/companies",
        query: { ...this.companySearchObject, searchType: this.searchType }
      });
    }
  }
};
</script>