<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="pagination.rowsPerPage"
    :footer-props="{
      'items-per-page-options': pagination.rowsPerPageItems
    }"
    class="elevation-1 ma-2"
    @update:pagination="updatePagination"
    :server-items-length="totalItems"
  >
    <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
    <template v-slot:item="{ item, headers }">
      <tr>
        <td>
          <router-link :to="`/companies/${ item.uid}`">{{ item.name }}</router-link>
        </td>
        <td>{{ item.totalSignals || "0"}}</td>
        <td>{{ item.totalScore || "0"}}</td>
        <td>{{ item.numEmployees || "0"}}</td>
        <td>{{ item.state || "--"}}</td>
        <td>{{ item.country || "--"}}</td>
        <td>{{ item.momentum || "--"}}</td>
        <td>{{ item.website || "--"}}</td>
        <td>{{ item.vertical || "--" }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import _get from "lodash.get";
import LongParagraph from "./LongParagraph";
export default {
  data() {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 25,
        rowsPerPageItems: [25, 50, 100]
      },
      totalItems: 10000000,
      headers: [
        { text: "Company", value: "name", sortable: false},
        { text: "Signals", value: "totalSignals" },
        { text: "Score", value: "totalScore" },
        { text: "Emp.", value: "numEmployees" },
        { text: "State", value: "state", sortable: false },
        { text: "Country", value: "country", sortable: false },
        { text: "Momentum", value: "momentum", sortable: false },
        { text: "Url", value: "url", sortable: false },
        { text: "Vertical", value: "vertical", sortable: false }
      ]
    };
  },
  /* apollo: {
    playlists: PLAYLISTS
  } */
  methods: {
    updatePagination(dataFromEvent = {}) {
      this.$emit("updatePagination", { dataFromEvent });
    },
    _get: _get,
    trimText(text = "") {
      return `${text.substring(0, 100)}${text.length > 100 ? "..." : ""}`;
    }
  },
  props: {
    items: Array,
    props: []
  },
  components: {
    LongParagraph
  }
};
</script>
<style scoped>
.wrapping-td {
  white-space: normal;
}
</style>

