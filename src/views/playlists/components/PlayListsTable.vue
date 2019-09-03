<template >
  <v-data-table
  
    :headers="headers"
    :items="items"
    :loading="!items.length"
    :pagination.sync="pagination"
    :rows-per-page-items="pagination.rowsPerPageItems"
    class="elevation-1 ma-2"
    @update:pagination="updatePagination"
    :total-items="totalItems"
  >
    <div>{{ JSON.stringify(props) }}</div>
    <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
    <template v-slot:items="props">
      <td> 
        <router-link :to="`playlists/${props.item.uid}/companies`">
          {{
          props.item.name
          }}
        </router-link>
      </td>
      <td>{{ props.item.totalCompanies }}</td>
      <td>{{ props.item.totalSignals || "0" }}</td>
      <td>{{ props.item.totalScore || "0" }}</td>
      <td>contacts coming soon</td>
      <td>
        <router-link :to="`/advanced/${props.item.uid}`">Advanced</router-link>
      </td>
      <td>{{ props.item.userId }}</td>
      <td>{{ props.item.creationTime }}</td>
      <td>
        <a href>Add Coming soon</a>
      </td>
      <td>
        <a href>Remove Coming soon</a>
      </td>
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
          text: "# companies",
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
        { text: "Remove", align: "left", value: "remove" }
      ]
    };
  },
  methods: {
    updatePagination(dataFromEvent = {}) {
      this.$emit("updatePagination", { dataFromEvent });
    }
  },
  props: {
    items: Array,
    props: []
  }
};
</script>
