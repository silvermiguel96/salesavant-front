<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="!items.length"
    class="elevation-1"
  >
    <v-progress-linear
      v-slot:progress
      color="blue"
      indeterminate
    ></v-progress-linear>
    <template v-slot:items="props">
      <td>
        <a
          :key="`link${props.item.uid}`"
          :href="`companies/${props.item.uid}`"
          >{{ props.item.name }}</a
        >
      </td>
      <td>{{ props.item.signals.length }}</td>
      <td>{{ props.item.status }}</td>
      <td>
        <p>{{ props.item.description }}</p>
      </td>
      <td>{{ props.item.city }}</td>
      <td>{{ props.item.state }}</td>
      <td>{{ props.item.country }}</td>
      <td>{{ props.item.numEmployees }}</td>
      <td>{{ props.item.momentum }}</td>
      <td>{{ props.item.url }}</td>
      <td>{{ props.item.vertical }}</td>
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
          text: "Company",
          align: "left",
          sortable: true,
          value: "name"
        },
        { text: "Signals", value: "signals.length" },
        { text: "Status", value: "status", align: "left" },
        { text: "Description", value: "description", align: "left" },
        { text: "City", value: "city", align: "left" },
        { text: "State", value: "state", align: "left" },
        { text: "Country", value: "country", align: "left" },
        { text: "Emp.", value: "numEmployees", align: "left" },
        { text: "Momentum", value: "momentum", align: "left" },
        { text: "Website", value: "url", align: "left" },
        { text: "Vertical" }
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
