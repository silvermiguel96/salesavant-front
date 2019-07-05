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
      <td>{{props.item.id || ""}}</td>
      <td>{{props.item.name || ""}}</td>
      <td>{{props.item.description || ""}}</td>
      <td>{{props.item.group || ""}}</td>
      <td>{{props.item.category || ""}}</td>
      <td>{{props.item.defaultScore || ""}}</td>
      <td>{{props.item.creationTime || ""}}</td>
      <td>{{props.item.modificationTime || ""}}</td>
      <td>
        <router-link v-if="props.item.id" :to="`/signals/${props.item.id}`">
          <v-icon>edit</v-icon>
        </router-link>
        <v-icon>delete</v-icon>
      </td>
    </template>
  </v-data-table>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
import _get from "lodash.get";
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
          text: "ID",
          align: "left",
          sortable: true,
          value: "id"
        },
        { text: "Name", value: "name", sortable: true },
        {
          text: "Description",
          value: "description",
          align: "left"
        },
        { text: "Group", value: "group", align: "left" },
        { text: "Category", value: "category", align: "left" },
        { text: "Default Score", value: "defaultScore", align: "left" },
        { text: "Creation Time", value: "creationTime", align: "left" },
        { text: "Modification Time", value: "modificationTime", align: "left" },
        { text: "-", align: "left" }
      ]
    };
  },
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
  }
};
</script>
<style scoped>
.wrapping-td {
  white-space: normal;
}
</style>

