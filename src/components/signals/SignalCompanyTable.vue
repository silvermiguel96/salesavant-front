<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :server-items-length="totalResults"
    :items-per-pag="options.itemsPerPage"
    :footer-props="{
      'items-per-page-options': [10, 20, 50]
    }"
    :options.sync="options"
    @update:options="updateOptions"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>
          <router-link :to="`/companies/${item.uid}`">{{
            item.name || "--"
          }}</router-link>
        </td>
        <td>
          {{ item.totalScore || 0}}
        </td>
        <td>
          {{ item.numEmployees || 0}}
        </td>
        <td>
          {{ item.country || "--" }}
        </td>
        <td>
          {{ item.state || "--"}}
        </td> 
        <td>
          {{ item.modificationTime | moment("MMMM Do YYYY, H:mm")}}
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
          value: "name",
          width: "20%",
        },
        {
          text: "Score",
          value: "totalScore",
          width: "15%",
        },
        {
          text: "Employes",
          value: "numEmployees",
          width: "15%",
        },
        {
          text: "Country",
          sortable: false,
          value: "country",
          width: "15%",
        },
        {
          text: "State",
          sortable: false,
          value: "state",
          width: "15%",
        },
        {
          text: "Modification Time",
          sortable: false,
          width: "20%",
          value: "modificationTime"
        },
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
