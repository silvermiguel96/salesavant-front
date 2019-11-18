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
        
        <td v-if="item.progress > 0 && item.progress < 100">
          <v-progress-circular
            :rotate="-90"
            :size="38"
            :width="4"
            color="light-blue"
            :value="item.progress.toFixed(0)"
            style="font-size: 0.9em;"
          >{{ item.progress.toFixed(0) }}%</v-progress-circular>
        </td>
        <td v-else-if="item.progress >= 100">100%</td>
        <td v-else>Waiting...</td>

        <td v-if="item.progress >= 100">
          <JobResult :job="item"/>
        </td>
        <td v-else>Loading...</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import JobResult from './JobResult';

export default {
  data() {
    return {
      headers: [
        { text: "JobType", value: "jobType", width: "25%", sortable: false },
        {
          text: "Description",
          value: "description",
          width: "35%",
          sortable: false
        },
        { text: "Creation Time",
          value: "creationTime",
          width: "20%",
          sortable: false
        },
        { text: "Progress", value: "progress", width: "10%", sortable: false},
        { text: "Result", value: "result", width: "10%", sortable: false, align:"center"}
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
  },
  components:{
    JobResult
  }
};
</script>
