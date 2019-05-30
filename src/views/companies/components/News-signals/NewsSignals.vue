<template>
  <v-card class="ma-3">
    <v-card-title>
      <h1 class="display-1">News Signals</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table 
      :headers="headers"
      :items="items"
      :loading="!items.length"
      class="elevation-1">
        <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
        <template v-slot:items="props">
          <td>{{ props.item.company.name }}</td>
          <td>{{ props.item.title }}</td>
          <td>{{ props.item.publishDate }}</td>
          <td>{{ props.item.category }}</td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "Company", value: "company.name" },
        { text: "Title", value: "title" },
        { text: "Data", value: "publishDate"},
        { text: "Category", value: "category"}
      ]
    };
  },
  props: {
    items: Array,
    props: []
  }
};
</script>

<style>
</style>
