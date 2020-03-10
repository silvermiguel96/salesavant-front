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
    :single-expand="true"
    expanded.sync="expanded"
    item-key="uid"
    show-expand
  >
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <div class="ma-3" v-for="job in item.jobs" :key="job.id">
          <v-row no-gutters>
            <v-col cols="4">
              <div>
                <span class="subtitle-2 font-weight-medium">Name:</span>
                {{ job.id }}
              </div>
            </v-col>
            <v-col cols="3">
              <div>
                <span class="subtitle-2 font-weight-medium">Title:</span>
                {{ job.title }}
              </div>
            </v-col>
            <v-col cols="3">
              <div>
                <span class="subtitle-2 font-weight-medium">Title:</span>
                {{ job.company }}
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </div>
      </td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "Fullname", value: "fullname", width: "20%", sortable: false },
        { text: "Title", value: "title", width: "15%", sortable: false },
        { text: "Email", value: "email", width: "15%", sortable: true },
        { text: "Find", value: "find", width: "15%", sortable: true },
        {
          text: "Department",
          value: "deparment",
          width: "15%",
          sortable: true,
          divider: true
        },
        { text: "Linkedin", value: "linkedin", width: "20%", sortable: false }
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
<style scoped>
.wrapping-td {
  white-space: normal;
}
</style>

