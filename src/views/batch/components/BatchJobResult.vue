<template>
  <div style="text-align: center;">
    <div v-if="job.jobType=='playlist_from_file'">
      <div class="green--text text--lighten-1">Done</div>
    </div>
    <div v-else-if="job.jobType=='export_companies'">
      <a v-if="resultParsed" target="_blank" :href="salesavantAPI + resultParsed.fileName">Download</a>
    </div>
    <div v-if="job.jobType=='refresh_companies'">
      <div class="green--text text--lighten-1">Done</div>
    </div>
    <div v-if="job.jobType=='refresh_orb'">
      <div class="green--text text--lighten-1">Done</div>
    </div>
    <div v-if="job.jobType=='contacts_from_file'">
      <div class="green--text text--lighten-1">Done</div>
    </div>
    <div v-else-if="job.jobType=='refresh_keywords'">
      <KeywordsJobResult :job="job" />
    </div>
    <div v-else-if="job.jobType=='contact_finder'">
      <ContactsJobResult :job="job" />
    </div>
    <div v-else-if="job.jobType=='linkedin_finder'">
      <LinkedinJobResult :job="job" />
    </div>
  </div>
</template>

<script>
import KeywordsJobResult from "./KeywordsJobResult";
import ContactsJobResult from "./ContactsJobResult";
import LinkedinJobResult from "./LinkedinJobResult";
export default {
  data() {
    return {
      showKeywordsJobResult: false
    };
  },
  props: {
    salesavantAPI: { type: String, default: process.env.VUE_APP_REST_API_URL },
    job: Object
  },
  computed: {
    resultParsed: function() {
      if (!!this.job && !!this.job.result) {
        return JSON.parse(this.job.result);
      }
      return "";
    }
  },
  components: {
    KeywordsJobResult,
    ContactsJobResult,
    LinkedinJobResult
  }
};
</script>
