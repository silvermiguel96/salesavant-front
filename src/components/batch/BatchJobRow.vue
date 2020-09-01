<template >
  <tr>
    <td>
      <div>
        <div
          v-if="[
          'playlist_from_file',
          'playlist_from_search',
          'export_companies',
          'refresh_keywords',
          'salesforce_download'].includes(job.jobType)"
        >
          <router-link
            :to="`/playlists/${additionalDataParsed.playlist_uid}`"
          >{{ additionalDataParsed.playlist_name || "[Empty Name]" }}</router-link>
        </div>
        <div v-if="['signal_from_search'].includes(job.jobType)">
          <router-link
            :to="`/signals/${additionalDataParsed.signal_id}`"
          >{{ additionalDataParsed.signal_name || "[Empty Name]" }}</router-link>
        </div>
        <div
          v-else-if="[
          'contacts_from_file',
          'export_companies',
          'contact_finder',
          'linkedin_finder'].includes(job.jobType)"
        >
          <a
            :href="`${salesavantAPI}/files/download/${additionalDataParsed.storage_filename}`"
          >{{ additionalDataParsed.original_filename }}</a>
        </div>
      </div>
      <div class="font-weight-light text-capitalize">{{ getJobNameLocal(job.jobType) }}</div>
    </td>
    <td>{{ job.description || "--" }}</td>
    <td>{{ job.modificationTime | moment("MMMM Do YYYY, H:mm")}}</td>
    
    <td v-if="job.status=='created'">Waiting...</td>
    <td v-else-if="job.status=='running'">
      <v-progress-circular
        :rotate="-90"
        :size="38"
        :width="4"
        color="light-blue"
        :value="job.progress.toFixed(0)"
        style="font-size: 0.9em;"
      >{{ job.progress.toFixed(0) }}%</v-progress-circular>
    </td>
    <td v-else-if="job.status=='failed'">--</td>
    <td v-else-if="job.status=='finished'">100%</td>

    <td v-if="job.status=='finished'">
      <JobResult :job="job" />
    </td>
    <td v-else-if="job.status=='failed'" class="red--text text--lighten-1" style="text-align: center;">Failed</td>
    <td v-else>Loading...</td>
    <td>--</td>
  </tr>
</template>

<script>
import JobResult from "./BatchJobResult.vue";
import { getJobName } from "../../commons.js";
export default {
  data() {
    return {};
  },
  methods: {
    getJobNameLocal(jobType) {
      return getJobName(jobType);
    },
  },
  props: {
    salesavantAPI: { type: String, default: process.env.VUE_APP_REST_API_URL },
    job: Object,
  },
  computed: {
    additionalDataParsed: function () {
      if (!!this.job && !!this.job.additionalData) {
        return JSON.parse(this.job.additionalData);
      }
      return "";
    },
  },
  components: {
    JobResult,
  },
};
</script>
