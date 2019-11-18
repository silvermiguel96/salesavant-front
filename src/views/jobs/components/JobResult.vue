<template>
    <div style="text-align: center;">
        <div v-if="job.jobType=='refresh_orb'">
            <div class="green--text text--lighten-1" >
                Done
            </div>
        </div>
        <div v-else-if="job.jobType=='extract_keywords'">
            <KeywordsJobResult :job="job"/>
        </div>
        <div v-else-if="job.jobType=='export_companies'">
            <a v-if="resultParsed" target="_blank" :href="resultParsed.fileName">Download</a>
        </div>
    </div>
</template>

<script>
import KeywordsJobResult from './KeywordsJobResult'
export default {
  data() {
    return {
        showKeywordsJobResult: false
    };
  },
  props: {
    job: Object
  },
  computed:{
    resultParsed: function(){
        if (!!this.job && !! this.job.result){
            return JSON.parse(this.job.result);
        }
    }
  },
  components:{
      KeywordsJobResult
  }
};
</script>
