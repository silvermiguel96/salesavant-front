<template >
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="!items.length"
    :items-per-page="pagination.rowsPerPage"
    :footer-props="{
      'items-per-page-options': pagination.rowsPerPageItems
    }"
    class="elevation-1 ma-2"
    @update:pagination="updatePagination"
    :server-items-length="totalItems"
  >
    <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
    <template v-slot:item="{ item, headers }">
      <tr>
        <td>
          <router-link :to="`playlists/${item.uid}/companies`">
            {{
            item.name
            }}
          </router-link>
        </td>
        <td>{{ item.totalCompanies }}</td>
        <td>{{ item.totalSignals || "0" }}</td>
        <td>{{ item.totalScore || "0" }}</td>
        <td>
          <p>contacts coming soon</p>
        </td>
        <td>
          <router-link :to="`/advanced/${item.uid}`">Advanced</router-link>
        </td>
        <td>{{ item.userId }}</td>
        <td>{{ changeTimeHuman(item.creationTime) }}</td>
        <td>
          <a href>Add Coming soon</a>
        </td>
        <td>
          <a href>Remove Coming soon</a>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
export default {
  data() {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 25,
        rowsPerPageItems: [25, 50, 100]
      },
      totalItems: 100000,
      headers: [
        {
          text: "Name",
          align: "left",
          sortable: true,
          value: "name"
        },
        {
          text: "Size",
          value: "companies.length",
          align: "left"
        },
        { text: "Signals", value: "signalsCount", align: "left" },
        { text: "Score", value: "scoreCount", align: "left" },
        { text: "Contacts", align: "left", value: "contacts" },
        { text: "Advanced", align: "left", value: "advanced" },
        { text: "Owner", value: "userId", align: "left" },
        { text: "Creation Time", value: "creationTime", align: "left" },
        { text: "Favorite", align: "left", value: "favorite" },
        { text: "Remove", align: "left" }
      ]
    };
  },
  methods: {
    updatePagination(dataFromEvent = {}) {
      this.$emit("updatePagination", { dataFromEvent });
    },
    changeTimeHuman(time) {
      var HumanDate = time.split(".", 1).toString();
      var HumanTime = HumanDate.split("T", 2).join(" ");
      return HumanTime;
    }
  },
  props: {
    items: Array,
    props: []
  }
};
</script>
