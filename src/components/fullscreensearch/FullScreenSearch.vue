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
        <companies-search @change="changeSimpleSearch" @toggle="toggle" @search="search" />
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="notifications"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Notifications</v-list-tile-title>
              <v-list-tile-sub-title>Notify me about updates to apps or games that I downloaded</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="sound"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Sound</v-list-tile-title>
              <v-list-tile-sub-title>Auto-update apps at any time. Data charges may apply</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="widgets"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Auto-add widgets</v-list-tile-title>
              <v-list-tile-sub-title>Automatically add home screen widgets</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import SimpleSearch from "./SimpleSearch.vue";
import CompaniesSearch from "./CompaniesSearch.vue";

const defaultCompanySearchObject = {
  name: "",
  description: "",
  uid: ""
};

export default {
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
      simpleSearch: "",
      companySearchObject: { ...defaultCompanySearchObject }
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
      this.toggle();
      if (!!this.simpleSearch) {
        this.onSimpleSearch();
      } else {
        this.onCompanySearch();
      }
    },
    changeSimpleSearch(data) {
      this.companySearchObject = { ...defaultCompanySearchObject };
      this.simpleSearch = data.simpleSearch || "";
    },
    onSimpleSearch() {
      if (!!this.simpleSearch) {
        this.$router.push({
          path: "/companies",
          query: { simpleSearch: this.simpleSearch, searchType: "simple" }
        });
      }
    },
    onCompanySearch() {
      this.$router.push({
        path: "/companies",
        query: { ...this.companySearchObject, searchType: "company" }
      });
    }
  }
};
</script>