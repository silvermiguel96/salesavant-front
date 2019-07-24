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
    <template v-slot:items="props">
      <td>
        <router-link
          :to="`/companies/${props.item.company.uid}`"
        >{{ props.item.company.name || "--" }}</router-link>
      </td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      totalItems: 10000000,
      pagination: {
        page: 1,
        rowsPerPage: 25,
        rowsPerPageItems: [25, 50, 100]
      },
      headers: [
        {
          text: "Company name",
          sortable: false,
          value: "name"
        }
      ]
    };
  },
  props: {
    items: { type: Array }
  },
  methods: {
    updatePagination(dataFromEvent = {}) {
      this.$emit("updatePagination", { dataFromEvent });
    }
  }
};
</script>