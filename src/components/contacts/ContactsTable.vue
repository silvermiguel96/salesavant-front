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
    <template v-slot:item="{ item, headers }">
      <tr>
        <td>{{ item.fullName }}</td>
        <td>{{ item.personalEmail }}</td>
        <td>{{ item.personalPhone }}</td>
        <td>{{ item.linkedinHandle || "--"}}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "Fullname", value: "name", width: "20%", sortable: false },
        { text: "Email", value: "totalScore", width: "10%", sortable: true },
        { text: "Phone", value: "numEmployees", width: "12%", sortable: true, divider: true },
        { text: "Linkedin", value: "state", width: "15%", sortable: false },
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
  },
  props: {
    items: Array,
    totalResults: Number
  }
};
</script>
<style scoped>
.wrapping-td {
  white-space: normal;
}
</style>

