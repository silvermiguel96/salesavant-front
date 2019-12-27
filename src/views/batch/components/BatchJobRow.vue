<template >
  <tr>
    <td>
      <div>
        <router-link
          :to="`/playlists/${additionalDataParsed.playlist_uid}/companies`"
        >{{ additionalDataParsed.playlist_name }}</router-link>
      </div>
      <div class="font-weight-light">{{ getJobName(job.jobType) }}</div>
    </td>
    <td>{{ job.description || "--" }}</td>
    <td>{{ changeTimeHuman(job.creationTime) }}</td>
    <td v-if="job.progress > 0 && job.progress < 100">
      <v-progress-circular
        :rotate="-90"
        :size="38"
        :width="4"
        color="light-blue"
        :value="job.progress.toFixed(0)"
        style="font-size: 0.9em;"
      >{{ job.progress.toFixed(0) }}%</v-progress-circular>
    </td>
    <td v-else-if="job.progress >= 100">100%</td>
    <td v-else>Waiting...</td>

    <td v-if="job.progress >= 100">
      <JobResult :job="job" />
    </td>
    <td v-else>Loading...</td>
  </tr>
</template>

<script>
import JobResult from "./BatchJobResult";

export default {
  data() {
    return {};
  },
  methods: {
    changeTimeHuman(time) {
      let HumanDate = time.split(".", 1).toString();
      let HumanTime = HumanDate.split("T", 2).join(" ");
      return HumanTime;
    },
    getJobName(jobType) {
      switch (jobType) {
        case "extract_keywords":
          return "Extract Keywords";
        case "refresh_orb":
          return "Refresh ORB";
        case "export_companies":
          return "Export Companies";
        case "refresh_news":
          return "Refresh News";
      }
    }
  },
  props: {
    job: Object
  },
  computed: {
    additionalDataParsed: function() {
      if (!!this.job && !!this.job.additionalData) {
        return JSON.parse(this.job.additionalData);
      }
      return "";
    }
  },
  components: {
    JobResult
  }
};
</script>
