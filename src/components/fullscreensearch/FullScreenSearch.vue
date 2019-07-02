<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark>
          <v-btn icon dark @click="toggle">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Search</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn @click="search" color="primary">
              <v-icon>search</v-icon>
              {{" Search"}}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <simple-search @change="changeSimpleSearch" @toggle="toggle" @search="onSimpleSearch" />
        <v-divider></v-divider>
        <companies-search
          @change="changeCompanySearchObject"
          @toggle="toggle"
          @search="onCompanySearch"
        />
        <v-divider></v-divider>
        <news-search @change="changeNews" @toggle="toggle" @search="onNewsSearch" />
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import SimpleSearch from "./SimpleSearch.vue";
import CompaniesSearch from "./CompaniesSearch.vue";
import NewsSearch from "./NewsSearch.vue";

const defaultCompanySearchObject = {
  name: "",
  country: "",
  website: "",
  city: "",
  region: "",
  state: "",
  status: "",
  lessThanEmployees: "",
  moreThanEmployees: ""
};

export default {
  data() {
    return {
      notifications: false,
      sound: true,
      widgets: false,
      simpleSearch: "",
      companySearchObject: { ...defaultCompanySearchObject },
      searchType: null,
      news: ""
    };
  },
  props: {
    show: { type: Boolean, default: false }
  },
  components: {
    SimpleSearch,
    CompaniesSearch,
    NewsSearch
  },
  methods: {
    toggle() {
      this.$emit("toggle", { show: !this.$props.show });
    },
    search() {
      switch (this.searchType) {
        case "simple":
          this.onSimpleSearch();
          break;
        case "company":
          this.onCompanySearch();
          break;
        case "news":
          this.onNewsSearch();
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
    changeNews(data) {
      this.searchType = "news";
      this.news = data.news;
    },
    onSimpleSearch() {
      this.toggle();
      this.$router.push({
        path: "/companies",
        query: {
          simpleSearch: this.simpleSearch,
          searchType: "simple"
        }
      });
    },
    onCompanySearch() {
      this.toggle();
      this.$router.push({
        path: "/companies",
        query: { ...this.companySearchObject, searchType: "company" }
      });
    },
    onNewsSearch() {
      this.toggle();
      this.$router.push({
        path: "/news",
        query: { news: this.news, searchType: "news" }
      });
    }
  }
};
</script>