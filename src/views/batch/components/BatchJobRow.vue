<template >
  <tr>
    <td>
      <div>
        <div v-if="job.jobType=='playlist_from_file' || job.jobType=='export_companies' || job.jobType=='refresh_keywords'">
          <router-link
            :to="`/playlists/${additionalDataParsed.playlist_uid}`"
          >{{ additionalDataParsed.playlist_name || "[Empty Name]" }}</router-link>
        </div>
        <div v-else-if="job.jobType=='contacts_from_file' || job.jobType=='export_companies' || job.jobType=='contact_finder' || job.jobType=='linkedin_finder'"  >
          <a
            :href="`${salesavantAPI}/files/download/${additionalDataParsed.storage_filename}`"
          >{{ additionalDataParsed.original_filename }}</a>
        </div>
      </div>
      <div class="font-weight-light">{{ getJobName(job.jobType) }}</div>
    </td>
    <td>{{ job.description || "--" }}</td>
    <td> <format-date-time :time="job.creationTime"/> </td>
    <td v-if="job.progress > 0 && job.status != 'finished'">
      <v-progress-circular
        :rotate="-90"
        :size="38"
        :width="4"
        color="light-blue"
        :value="job.progress.toFixed(0)"
        style="font-size: 0.9em;"
      >{{ job.progress.toFixed(0) }}%</v-progress-circular>
    </td>
    <td v-else-if="job.status == 'finished'">100%</td>
    <td v-else>Waiting...</td>
    <td v-if="job.status == 'finished'">
      <JobResult :job="job" />
    </td>
    <td v-else>Loading...</td>
  </tr>
</template>

<script>
import formatDateTime from "../../../components/common/FormatDateTime.vue";

import JobResult from "./BatchJobResult";

export default {
  data() {
    return {};
  },
  methods: {
    getJobName(jobType) {
      switch (jobType) {
        case "refresh_keywords":
          return "Refresh Keywords";
        case "refresh_companies":
          return "Refresh Companies";
        case "refresh_orb":
          return "Refresh ORB";
        case "export_companies":
          return "Export Companies";
        case "refresh_news":
          return "Refresh News";
        case "refresh_news":
          return "Refresh News";
        case "contact_finder":
          return "Contact Finder";
        case "linkedin_finder":
          return "LinkedIn Finder";
        case "playlist_from_file":
          return "Playlist From File";
        case "contacts_from_file":
          return "Contacts From File";
      }
      return jobType;
    }
  },
  props: {
    salesavantAPI: { type: String, default: process.env.VUE_APP_REST_API_URL },
    job: Object
  },
  computed: {
    additionalDataParsed: function() {
      if (!!this.job && !!this.job.additionalData) {
        return JSON.parse(this.job.additionalData);
      }
      return "";
    },
    jobSubtitle: function() {
      if (this.additionalDataParsed.hasOwnProperty("playlist_name")) {
        return this.additionalDataParsed.playlist_name;
      }
      if (this.additionalDataParsed.hasOwnProperty("original_filename")) {
        return this.additionalDataParsed.original_filename;
      }
      return "";
    }
  },
  components: {
    JobResult,
    formatDateTime
  }
};
</script>
