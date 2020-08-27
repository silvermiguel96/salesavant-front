<template >
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
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.textDescription }}</td>
        <td>{{ item.description || "--" }}</td>
        <td>{{ item.modificationTime | moment("MMMM Do YYYY, H:mm") }}</td>
        <td>{{ item.lastResult | moment("MMMM Do YYYY, H:mm")}}</td>
        <td v-if="item.periodicity">{{ item.periodicity || "--"}}</td>
        <td v-else>{{ item.scheduleTime | moment("MMMM Do YYYY, H:mm") }}</td>
        <td>
          <div class="d-flex align-center justify-center">{{ item.count || "0"}}</div>
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
        { text: "Job Name", value: "jobType", width: "20%", sortable: false },
        {
          text: "Description",
          value: "description",
          width: "20%",
          sortable: false
        },
        {
          text: "Modification Time",
          value: "modificationTime",
          width: "15%",
          sortable: false
        },
        {
          text: "Last Result",
          value: "lastResult",
          width: "15%",
          sortable: false
        },
        {
          text: "Periodicity/Schedule Time",
          value: "periodicity",
          width: "20%",
          sortable: false
        },
        {
          text: "Count",
          value: "count",
          width: "10%",
          sortable: false,
          align: "center"
        }
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
    }
  },
  props: {
    items: Array,
    totalResults: Number
  }
};
</script>
