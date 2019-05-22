<template>
  <v-data-table :headers="headers" :items="items" :loading="!items.length" class="elevation-1">
    <div>{{JSON.stringify(props)}}</div>
    <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
    <template v-slot:items="props">
      <td>{{ props.item.uid }}</td>
      <td>
        <a
          :key="`link${props.item.uid}`"
          :href="`companies/${props.item.uid}`"
        >{{ props.item.name }}</a>
      </td>
      <td></td>
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
        { text: "Creation Time", value: "creationTime", align: "left" },
        { text: "Companies", value: "companies", align: "left" }
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