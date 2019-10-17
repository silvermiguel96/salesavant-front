<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="pagination.rowsPerPage"
    :footer-props="{
      'items-per-page-options': pagination.rowsPerPageItems
    }"
    class="elevation-1"
    @update:pagination="updatePagination"
    :server-items-length="totalItems"
  >
    <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
    <template v-slot:item="{ item, headers }">
      <tr>
        <td>
          <a
            :key="`news-link${item.id || ''}`"
            :href="`news/${item.id || ''}`"
          >{{
            trimText(item.title)
             }}</a>
             <!-- trimText(_get( "item.title", "--")) -->
        </td>
        <td>
          <a
            :key="`company-link${item.id}`"
            :href="`companies/${item.company.uid || ''}`"
          >{{ 
            trimText(item.company.name)
            }}</a>
            <!-- trimText(_get( "item.company.name", "--")) -->
        </td>
        <td>
          <a
            :key="`news-external-link${item.id || ''}`"
            :href="item.url || ''"
            target="_blank"
          >visit source</a>
        </td>
        <td>{{ item.category || "--" }}</td>
        <td>{{ item.publishDate || "--"}}</td>
        <td>{{ item.creationTime || "--" }}</td>
      </tr>
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
        },
      ]
    };
  },
  methods: {
    updatePagination(dataFromEvent = {}) {
      this.$emit("updatePagination", { dataFromEvent });
    },
    _get: _get,
    trimText(text = "") {
      if (!!text) {
        return `${text.substring(0, 35)}${text.length > 35 ? "..." : ""}`;
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

