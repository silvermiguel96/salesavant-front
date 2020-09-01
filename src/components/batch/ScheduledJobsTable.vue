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
    <template v-slot:item="{ item, index}">
      <tr>
        <td>{{ getJobNameLocal(item.jobType) }}</td>
        <td>{{ item.description || "--" }}</td>
        <td>{{ item.lastResult || "--"}}</td>
        <td v-if="item.periodicity">{{ item.periodicity || "--"}}</td>
        <td v-else>{{ item.scheduleTime | moment("MMMM Do YYYY, H:mm") }}</td>
        <td>{{ item.modificationTime | moment("MMMM Do YYYY, H:mm") }}</td>
        <td>
          <div class="d-flex align-center justify-center">
            <v-icon @click="deleteScheduledJob(item, index)" color="red lighten-2" size="20" small>delete</v-icon>
          </div>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { getJobName } from "../../commons.js";

export default {
  data() {
    return {
      headers: [
        { text: "Job Name", value: "jobType", width: "20%", sortable: false },
        {
          text: "Description",
          value: "description",
          width: "20%",
          sortable: false,
        },

        {
          text: "Last Result",
          value: "lastResult",
          width: "15%",
          sortable: false,
        },
        {
          text: "Periodicity/Schedule Time",
          value: "periodicity",
          width: "20%",
          sortable: false,
        },
        {
          text: "Modification Time",
          value: "modificationTime",
          width: "20%",
          sortable: false,
        },
        {
          text: "Actions",
          width: "10%",
          sortable: false,
          align: "center",
        },
      ],
      options: {
        page: 1,
        itemsPerPage: 10,
      },
    };
  },
  methods: {
    updateOptions(dataFromEvent = {}) {
      this.$emit("updateOptions", { dataFromEvent });
    },
    getJobNameLocal(jobType) {
      return getJobName(jobType);
    },
    async deleteScheduledJob(item, index) {
      const res = await this.$confirm(
        ` <h1 class="subtitle-1">
          Confirm you want to eliminate the Scheduled Job <span class="font-weight-bold">${this.getJobNameLocal(item.jobType)}</span>?
          </h1>`,
        {
          buttonTrueText: "delete",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "primary",
          icon: "delete",
          title: "Delete Scheduled Job",
          width: 600,
        }
      );
      if (res) {
        this.$emit("delete-scheduled-job", item, index);
      }
    },
  },
  props: {
    items: Array,
    totalResults: Number,
  },
};
</script>
