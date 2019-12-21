<template>
    <v-dialog
      :value="value"
      max-width="530"
      hide-overlay
      transition="dialog-bottom-transition"
      @keydown.esc="hideSearchDialog"
      persistent
      scrollable>
      <v-card>
        <v-toolbar dark color="primary" height="48px">
          <v-toolbar-title>Advanced Search</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="hideSearchDialog" align-end>
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-content>
          <companies-search />
        </v-content>
      </v-card>
    </v-dialog>
</template>

<script>
import CompaniesSearch from "./CompaniesSearch.vue";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      searchType: null
    };
  },
  props: {
    value: { type: Boolean, default: false }
  },
  components: {
    CompaniesSearch
  },
  methods: {
    ...mapMutations([
      'hideSearchDialog'
    ]),
  }
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
