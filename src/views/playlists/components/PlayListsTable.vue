<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="!items.length"
    class="elevation-1"
  >
    <div>{{ JSON.stringify(props) }}</div>
    <v-progress-linear
      v-slot:progress
      color="blue"
      indeterminate
    ></v-progress-linear>
    <template v-slot:items="props">
      <td>{{ props.item.name }}</td>
      <td>{{ props.item.companies.length }}</td>
      <td>{{ props.item.signals.length }}</td>
      <td>contacts coming soon</td>
      <td>Advanced coming soon</td>
      <td>{{ props.item.userId }}</td>
      <td>{{ props.item.creationTime }}</td>
      <td>
        <div
          v-for="(company, index) in props.item.companies"
          :key="company.uid"
        >
          <a :key="`link${company.uid}`" :href="`companies/${company.uid}`">{{
            company.name
          }}</a>
          <span v-if="index + 1 < props.item.companies.length">,</span>
        </div>
      </td>
      <td>
        <a href=""> Add Coming soon</a>
      </td>
      <td>
        <a href=""> Remove Coming soon</a>
      </td>
    </template>
  </v-data-table>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
export default {
  data() {
    return {
      headers: [
        {
          text: "Name",
          align: "left",
          sortable: true,
          value: "name"
        },
        { text: "Total", value: "companies.length", align: "left" },
        { text: "Signals", value: "signals.length", align: "left" },
        { text: "Contacts", align: "left" },
        { text: "Advanced", align: "left" },
        { text: "Owner", value: "userId", align: "left" },
        { text: "Creation Time", value: "creationTime", align: "left" },
        { text: "Companies", value: "companies", align: "left" },
        { text: "Favorite", align: "left" },
        { text: "Remove", align: "left" }
      ]
    };
  },
  /* apollo: {
    playlists: PLAYLISTS
  } */
  props: {
    items: Array,
    props: []
  }
};
</script>
