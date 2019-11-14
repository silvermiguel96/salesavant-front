<template>
  <v-data-table
    :headers="headers"
    :items="items"
    class="elevation-1 mx-2"
    :server-items-length="totalResults"
    :items-per-pag="options.itemsPerPage"
    :footer-props="{
      'items-per-page-options': [10, 20, 50]
    }"
    :options.sync="options"
    @update:options="updateOptions"
  >
    <template v-slot:item="{ item, headers }">
      <tr>
        <td>
          <router-link :to="`/companies/${item.uid}`">{{
            item.name || "--"
          }}</router-link>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "Company name",
          sortable: false,
          value: "name"
        }
      ],
      options: {
        page: 1,
        itemsPerPage: 10
      }
    };
  },
  props: {
    items:Array, 
    totalResults: Number 
  },
  methods: {
    updateOptions(dataFromEvent = {}) {
      this.$emit("updateOptions", { dataFromEvent });
    }
  }
};
</script>
