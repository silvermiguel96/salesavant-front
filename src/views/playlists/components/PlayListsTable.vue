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
        <td>
          <router-link :to="`playlists/${item.uid}`">{{item.name}}</router-link>
        </td>
        <td>{{ item.totalCompanies ? item.totalCompanies.toLocaleString() : "0"}}</td>
        <td>{{ changeTimeHuman(item.creationTime) }}</td>
        <td>
          <p >Coming soon</p>
        </td>
        <td>
          <p>Coming soon</p>
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
        { text: "Name", value: "name", width: "40%", sortable: true },
        { text: "Size", value: "totalCompanies", width: "10%", sortable: true },
        { text: "Creation Time", value: "creationTime", width: "16%", sortable: false},
        { text: "Favorite", value: "favorite", width: "8%", sortable: false },
        { text: "Remove", width: "8%", sortable: false }
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
