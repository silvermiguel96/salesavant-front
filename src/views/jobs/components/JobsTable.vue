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
    <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
    <template v-slot:item="{ item, headers }">
      <tr>
        <td>{{ item.jobType || "--" }}</td>
        <td>{{ item.description || "--" }}</td>
        <td>{{ changeTimeHuman(item.creationTime) }}</td>
        <td>{{ item.status || "--" }}</td>
        <td>{{ item.progress || "0%" }}</td>
        <td>{{ item.result || "--" }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "JobType", value: "jobType", width: "15%", sortable: false },
        { text: "Description", value: "description", width: "20%", sortable: false },
        { text: "Creation Time", value: "creationTime", width: "15%", sortable: false},
        { text: "Status", value: "status", width: "15%", sortable: true },
        { text: "Progress", value: "progress", width: "15%", sortable: true },
        { text: "Result", value: "result", width: "20%", sortable: true }
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
    changeTimeHuman(time) {
      let HumanDate = time.split(".", 1).toString();
      let HumanTime = HumanDate.split("T", 2).join(" ");
      return HumanTime;
    }
  },
  props: {
    items: Array,
    totalResults: Number
  }
};
</script>
