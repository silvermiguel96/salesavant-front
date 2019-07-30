<template>
  <v-data-table
    :headers="headers"
    :items="items"
    class="elevation-1"
    :pagination.sync="pagination"
    :rows-per-page-items="pagination.rowsPerPageItems"
    @update:pagination="updatePagination"
    :total-items="totalItems"
  >
    <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
    <template v-slot:items="props">
      <td>
        <a
          :key="`link${props.item.uid}`"
          :href="`companies/${props.item.uid}`"
        >{{ props.item.name }}</a>
      </td>
      <!--TODO: remover comentarios-->
      <!--<td>{{ props.item.signalsCount || "0" }}</td>
      <td>{{ props.item.scoreCount || "0" }}</td>-->
      <td>{{ props.item.totalSignals || "--"}}</td>
      <td>{{ props.item.totalScore || "--"}}</td>
      <td class="wrapping-td">
        <long-paragraph :text="props.item.description"></long-paragraph>
      </td>
      <td>{{ props.item.city }}</td>
      <td>{{ props.item.state }}</td>
      <td>{{ props.item.country }}</td>
      <td>{{ props.item.numEmployees }}</td>
      <td>{{ props.item.momentum }}</td>
      <td class="wrapping-td">
        <long-paragraph :text="props.item.website"></long-paragraph>
      </td>
      <td>{{ props.item.url }}</td>
      <td>{{ props.item.vertical }}</td>
    </template>
  </v-data-table>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
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
        //TODO: poner los respectivos campos
        { text: "Signals", value: "signalsCount" },
        { text: "Score", value: "scoreCount" },
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

