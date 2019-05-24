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
      <td>
        <router-link :to="`playlists/${props.item.uid}/companies`">{{
          props.item.name
        }}</router-link>
      </td>
      <td>{{ props.item.companies.length }}</td>
      <td>{{ props.item.signals.length }}</td>
      <td>contacts coming soon</td>
      <td>Advanced coming soon</td>
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
      headers: [
        {
          text: "Name",
          align: "left",
          sortable: true,
          value: "name"
        },
        {
          text: "Number of companies",
          value: "companies.length",
          align: "left"
        },
        { text: "Signals", value: "signals.length", align: "left" },
        { text: "Contacts", align: "left" },
        { text: "Advanced", align: "left" },
        { text: "Owner", value: "userId", align: "left" },
        { text: "Creation Time", value: "creationTime", align: "left" },
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
