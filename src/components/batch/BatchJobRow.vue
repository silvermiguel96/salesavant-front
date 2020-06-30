<template >
  <tr>
    <td>
      <div>
        <div v-if="[
          'playlist_from_file',
          'export_companies',
          'refresh_keywords',
          'salesforce_download'].includes(job.jobType)">
          <router-link
            :to="`/playlists/${additionalDataParsed.playlist_uid}`"
          >{{ additionalDataParsed.playlist_name || "[Empty Name]" }}</router-link>
        </div>
        <div v-else-if="[
          'contacts_from_file',
          'export_companies',
          'contact_finder',
          'linkedin_finder'].includes(job.jobType)"  >
          <a
            :href="`${salesavantAPI}/files/download/${additionalDataParsed.storage_filename}`"
          >{{ additionalDataParsed.original_filename }}</a>
        </div>
      </div>
      <div class="font-weight-light">{{ getJobName(job.jobType) }}</div>
    </td>
    <td>{{ job.description || "--" }}</td>
    <td> 
    {{ job.modificationTime | moment("MMMM Do YYYY, H:mm")}} </td>
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
        case "playlist_aggs":
          return "Playlist Statistics Refresh"
        case "salesforce_download":
          return "Salesforce Download"
        case "salesforce_upload":
          return "Salesforce Upload"
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
    }
  },
  components: {
    JobResult,
  }
};
</script>
