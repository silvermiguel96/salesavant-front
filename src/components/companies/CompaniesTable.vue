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
        <td class="wrapping-td">
          <long-paragraph :text="item.description"></long-paragraph>
        </td>
        <td>{{ item.city || "--"}}</td>
        <td>{{ item.state || "--"}}</td>
        <td>{{ item.country || "--"}}</td>
        <td>{{ item.numEmployees || "0"}}</td>
        <td>{{ item.momentum || "--"}}</td>
        <td class="wrapping-td">
          <long-paragraph v-if="item.website" :text="item.website"></long-paragraph>
          <p v-else>{{"--"}}</p>
        </td>
        <td>{{ item.url || "--"}}</td>
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
        {
          text: "Company",
          align: "left",
          sortable: true,
          value: "name"
        },
        { text: "Signals", value: "totalSignals" },
        { text: "Score", value: "totalScore" },
        {
          text: "Description",
          value: "description",
          align: "left"
        },
        { text: "City", value: "city", align: "left" },
        { text: "State", value: "state", align: "left" },
        { text: "Country", value: "country", align: "left" },
        { text: "Emp.", value: "numEmployees", align: "left" },
        { text: "Momentum", value: "momentum", align: "left" },
        { text: "Website", value: "website", align: "left" },
        { text: "Url", value: "url", align: "left" },
        { text: "Vertical", value: "vertical", align: "left" }
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

