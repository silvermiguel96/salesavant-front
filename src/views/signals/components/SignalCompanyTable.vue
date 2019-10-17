<template>
  <v-data-table
    :headers="headers"
    :items="items"
    class="elevation-1"
    :pagination.sync="pagination"
    :items-per-pag="pagination.rowsPerPageItems"
    :footer-props="{
      'items-per-page-options': pagination.rowsPerPageItems
    }"
    @update:pagination="updatePagination"
    :server-items-length="totalItems"
  >
    <template v-slot:item="{ item, headers}">
      <tr>
        <td>
          <router-link
            :to="`/companies/${props.item.company.uid}`"
          >{{ props.item.company.name || "--" }}</router-link>
        </td>
      </tr>
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