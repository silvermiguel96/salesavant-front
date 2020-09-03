<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
      <v-breadcrumbs
        :large="true"
        :items="[
            {
              text: 'Batch Jobs',
              disabled: true
            },
          ]"
        divider=">"
      ></v-breadcrumbs>
          <v-tabs grow background-color="grey lighten-5" color="primary">
            <!-- Tab Home -->
            <v-tab class="text-capitalize">Jobs Queue</v-tab>
            <v-tab-item>
                <jobs />
            </v-tab-item>
            <!-- tab comments -->
            <v-tab class="text-capitalize">Scheduled Jobs</v-tab>
            <v-tab-item>
              <scheduled-jobs />
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import Jobs from "../../components/batch/Jobs/Jobs.vue";
import ScheduledJobs from "../../components/batch/Jobs/ScheduledJobs.vue";
export default {
  data() {
    return {

    }
  },
  components: {
    Jobs,
    ScheduledJobs
  }
}
</script>
