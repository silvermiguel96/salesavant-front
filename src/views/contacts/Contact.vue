<template>
  <v-container fluid>
    <v-row>
      <v-col md="6" xs="12" class="pt-0">
        <contact-profile />
      </v-col>
      <v-col md="6" xs="12" class="pt-0">
        <contact-history-jobs />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import contactProfile from "./components/ContactProfile.vue";
import contactHistoryJobs from "./components/ContactHistoryJobs.vue";
export default {
  data () {
    return {

    }
  },
  components: {
    contactProfile,
    contactHistoryJobs
  }
}
</script>