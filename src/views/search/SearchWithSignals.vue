<template>
  <v-card class="ma-3">
    <v-card-title>
      <div class="headline">Accounts with Signals</div>
    </v-card-title>
    <!-- search advanced filter -->
    <search-advanced-filter></search-advanced-filter>
    <!-- Buttons to export documents -->
    <buttons-download></buttons-download>
    <!-- Search All Acoounts -->
    <table-search></table-search>
  </v-card>
</template>
<script>
import SearchAdvancedFilter from "../../components/search/SearchAdvancedFilter.vue";
import ButtonsDownload from "../../components/search/ButtonsDownload.vue";
import TableSearch from "../../components/search/TableSearch.vue";

export default {
  data() {
    return {};
  },
  components: {
    ButtonsDownload,
    TableSearch,
    SearchAdvancedFilter
  }
};
</script>