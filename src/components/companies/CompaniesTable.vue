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
    @update:options="updateOptions"
    class="mx-2"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>
          <router-link :to="`/companies/${ item.uid}`">
            <long-paragraph :text="item.name" :maxLength="35"></long-paragraph>
          </router-link>
        </td>
        <td>{{ item.totalScore ? item.totalScore.toLocaleString() : "0"}}</td>
        <td>{{ item.numEmployees ? item.numEmployees.toLocaleString() : "0"}}</td>
        <td>{{ item.state || "--"}}</td>
        <td>{{ item.country || "--"}}</td>
        <td>{{ item.momentum || "--"}}</td>
        <td>
          <long-paragraph :text="item.industry" :maxLength="35" :capitalize="true"></long-paragraph>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import _get from "lodash.get";
import LongParagraph from "../../components/common/LongParagraph.vue";
export default {
  data() {
    return {
      headers: [ 
        { text: "Company", value: "name", width: "20%", sortable: false },
        { text: "Score", value: "totalScore", width: "10%", sortable: true },
        { text: "Employees", value: "numEmployees", width: "10%", sortable: true, divider: true },
        { text: "State", value: "state", width: "15%", sortable: false },
        { text: "Country", value: "country", width: "15%", sortable: false },
        { text: "Momentum", value: "momentum", width: "12%", sortable: false },
        { text: "Industry", value: "industry", width: "18%", sortable: false }
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
      return `${text.substring(0, 100)}${text.length > 100 ? "..." : ""}`;
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

