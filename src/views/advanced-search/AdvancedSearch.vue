<template>
  <v-dialog
    :value="value"
    max-width="530"
    hide-overlay
    transition="dialog-bottom-transition"
    @keydown.esc="hideSearchDialog"
    persistent
    scrollable
  >
    <v-card>
      <v-toolbar dark color="primary" height="48px">
        <v-toolbar-title class="text-capitalize">{{`Advanced ${searchType} Search`}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="hideSearchDialog" align-end>
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="pa-3">
        <companies-search v-if="searchType=='companies'" />
        <contacts-search v-else-if="searchType=='contacts'" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import CompaniesSearch from "../../components/advanced-search/CompaniesSearch.vue";
import ContactsSearch from "../../components/advanced-search/ContactsSearch.vue";
import { mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  props: {
    value: { type: Boolean, default: false },
  },
  components: {
    CompaniesSearch,
    ContactsSearch,
  },
  methods: {
    ...mapMutations(["hideSearchDialog"]),
  },
  computed: {
    searchType() {
      return this.$store.state.searchType;
    },
  },
};
</script>

<style scoped>
.v-dialog__content {
  justify-content: flex-end;
  height: unset;
  padding-top: 30px;
  margin-left: 16px;
}
.v-expansion-panel-header {
  min-height: 40px !important;
}
</style>
