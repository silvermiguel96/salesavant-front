<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :server-items-length="totalResults"
    :items-per-page="options.itemsPerPage"
    :footer-props="{
      'items-per-page-options': [10, 20, 50]
    }"
    :options.sync="options"
    class="mx-2"
    @update:options="updateOptions"
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
        <td>{{ item.publishDate || "--"}}</td>
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
      headers: [
        { text: "Title", align: "left", value: "title", sortable: false,  },
        { text: "Published Date", value: "publishDate", align: "left", sortable: true },
        { text: "Company", value: "company.name", align: "left",sortable: false },
        { text: "Url", value: "url", align: "left", sortable: false },
        { text: "Category", value: "category", sortable: false },
        { text: "Creation Time", value: "creationTime", align: "left", sortable: false },
      ],
      options: {
        page: 1,
        itemsPerPage: 10
      }
    };
  },
  methods: {
    updateOptions(dataFromEvent = {}) {
      this.$emit("updateOptions", { dataFromEvent });
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
    totalResults: Number
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

