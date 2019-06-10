<template>
  <v-card-text>
    <v-layout row wrap>
      <v-flex v-for="content in btnexports" :key="content.text">
        <v-btn color="success">{{ content.text }}</v-btn>
      </v-flex>
    </v-layout>
  </v-card-text>
</template>
<script>
export default {
  data() {
    return {
      btnexports: [
        { text: "Manage Groups" },
        { text: "Manage Signals" },
        { text: "Update Signals" },
        { text: "Recent Dialogues" },
        { text: "My Dialogues" },
        { text: "All Dialogues" },
        { text: "Vertical Signals" },
        { text: "Target Roles And Titles " },
      ]
    };
  }
};
</script>
