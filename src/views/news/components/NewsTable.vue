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
          :key="`news-link${props.item.id || ''}`"
          :href="`news/${props.item.id || ''}`"
        >{{ trimText(_get(props, "item.title", ""))}}</a>
      </td>
      <td>
        <a
          :key="`company-link${props.item.id}`"
          :href="`companies/${props.item.company.uid || ''}`"
        >{{ trimText(_get(props, "item.company.name", ""))}}</a>
      </td>
      <td>
        <a
          :key="`news-external-link${props.item.id || ''}`"
          :href="props.item.url || ''"
          target="_blank"
        >visit source</a>
      </td>
      <td>{{ props.item.category || "" }}</td>
      <td>{{ props.item.publishDate || ""}}</td>
      <td>{{ props.item.creationTime || "" }}</td>
    </template>
  </v-data-table>
</template>

<script>
import _get from "lodash.get";
import LongParagraph from "../../../components/companies/LongParagraph.vue";
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
          text: "News Title",
          align: "left",
          sortable: true,
          value: "title"
        },
        {
          text: "Company name",
          value: "company.name",
          align: "left"
        },
        { text: "Url", value: "url", align: "left" },
        { text: "Category", value: "category" },
        { text: "Published Date", value: "publishDate", align: "left" },
        {
          text: "Salesavant tracking date",
          value: "creationTime",
          align: "left"
        }
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
      if (!!text) {
        return `${text.substring(0, 50)}${text.length > 50 ? "..." : ""}`;
      }
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

