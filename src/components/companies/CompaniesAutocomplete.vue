<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :item-text="'name'"
      :item-value="'uid'"
      :items="companies"
      :search-input.sync="search"
      label="Select Company"
      @change="change"
      cache-items
      text
      dense
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
      companies: []
    };
  },
  watch: {
    search(val) {
      if (this.loading) return;
      this.queryCompanies();
    },
    globalCompanyUid(val) {
      this.select = val;
      this.$emit("change", {
        companiesUid: val,
        displayCompanyUid: this.globalDisplayCompanyUid
      });
    }
  },
  computed: {
    globalCompanyUid() {
      return this.companies.companiesUid;
    },
    globalDisplayCompanyUid() {
      return this.companies.displayCompanyUid;
    }
  },
  methods: {
    queryCompanies() {
      this.loading = true;
      setTimeout(() => {
        this.$apollo
          .query({
            query: gql`
              query getFilteredCompanies($searchName: String) {
                companies(first: 1000, searchName: $searchName) {
                  companiesList {
                    uid
                    name
                  }
                }
              }
            `,
            variables: {
              searchName: this.search ? this.search : ""
            },
            fetchPolicy: "no-cache"
          })
          .then(resp => {
            console.log("resp", resp)
            if (!!resp.data && !!resp.data.companies) {
              this.companies = resp.data.companies.companiesList.map(
                companies => {
                  return {
                    uid: companies.uid + ">>>" + companies.name,
                    name: companies.name
                  };
                }
              );
            }
          });
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }, 500);
    },
    change(v) {
      if (v && v.length > 0) {
        let idSplit = v.split(">>>");
        this.$emit("change", {
          companyUid: idSplit[0],
          displayCompanyUid: idSplit[1]
        });
      } else {
        this.$emit("change", {});
      }
    }
  }
};
</script>

<style scoped>
.v-list-item--dense,
.v-list--dense .v-list-item {
  min-height: 20px !important;
}
.v-list--dense .v-list-item .v-list-item__content,
.v-list-item--dense .v-list-item__content {
  padding: 6px 0;
}
</style>
