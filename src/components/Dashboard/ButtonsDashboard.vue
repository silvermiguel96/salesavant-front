<template>
  <v-card-text>
    <v-layout row wrap>
      <v-flex v-for="content in btnexports" :key="content.text">
        <v-btn small class="text-capitalize" color="success" :to="content.to" :disabled="content.disabled">{{ content.text }}</v-btn>
      </v-flex>
    </v-layout>
  </v-card-text>
</template>
<script>
export default {
  data() {
    return {
      btnexports: [
        { text: "Manage Groups", to: "", disabled: true },
        { text: "Manage Signals", to: "/signals", disabled: false },
        { text: "Update Signals", to: "", disabled: true },
        { text: "Recent Dialogues", to: "", disabled: true },
        { text: "My Dialogues", to: "", disabled: true },
        { text: "All Dialogues", to: "", disabled: true },
        { text: "Vertical Signals", to: "", disabled: true },
        { text: "Target Roles And Titles", to: "", disabled: true }
      ]
    };
  }
};
</script>
