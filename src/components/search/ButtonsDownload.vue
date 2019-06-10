<template>
  <v-card-text>
    <v-layout row wrap>
      <v-flex v-for="content in btnexports" :key="content.text">
        <v-btn flat color="info">{{ content.text }}</v-btn>
      </v-flex>
    </v-layout>
  </v-card-text>
</template>
<script>
export default {
  data() {
    return {
      btnexports: [
        { text: "Copy" },
        { text: "CSV" },
        { text: "Excel" },
        { text: "PDF" },
        { text: "Print" }
      ]
    };
  }
};
</script>
