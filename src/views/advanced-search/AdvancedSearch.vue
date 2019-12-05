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
          <v-btn icon @click.native="hideSearchDialog">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Advanced Search</v-toolbar-title>
        </v-toolbar>
        <v-expansion-panels accordion :value="expand">

          <v-expansion-panel>
            <v-expansion-panel-header>Companies</v-expansion-panel-header>
            <v-expansion-panel-content>
              <companies-search />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>Playlists</v-expansion-panel-header>
            <v-expansion-panel-content>
              <playlist-search />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>Signals</v-expansion-panel-header>
            <v-expansion-panel-content>
              <signals-search />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>News</v-expansion-panel-header>
            <v-expansion-panel-content>
              <news-search />
            </v-expansion-panel-content>
          </v-expansion-panel>

        </v-expansion-panels>
      </v-card>
    </v-dialog>
</template>

<script>
import CompaniesSearch from "./CompaniesSearch.vue";
import NewsSearch from "./NewsSearch.vue";
import PlaylistSearch from "./PlaylistSearch.vue";
import SignalsSearch from "./SignalsSearch.vue";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      searchType: null
    };
  },
  props: {
    value: { type: Boolean, default: false },
    expand: { type: Number, default: 0 }
  },
  components: {
    CompaniesSearch,
    PlaylistSearch,
    SignalsSearch,
    NewsSearch
  },
  methods: {
    ...mapMutations([
      'hideSearchDialog'
    ]),
  },
  mounted: function() {
    console.log("AdvancedSearch mounted");
  },
  beforeDestroy: function() {
    console.log("AdvancedSearch beforeDestroy");
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
</style>
