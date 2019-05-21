<template>
  <v-data-table :headers="headers" :items="items" :loading="!items.length" class="elevation-1">
    <div>{{JSON.stringify(props)}}</div>
    <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
    <template v-slot:items="props">
      <td>{{ props.item.name }}</td>
      <td>{{ props.item.creationTime }}</td>
      <td>
        <div v-for="(company, index) in props.item.companies" :key="company.uid">
          <a :key="`link${company.uid}`" :href="`company/${company.uid}`">{{ company.name }}</a>
          <span v-if="index+1 < props.item.companies.length">,</span>
        </div>
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