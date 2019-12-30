<template >
  <v-data-table
    :headers="headers"
    :items="items"
    :server-items-length="totalResults"
    :items-per-page="options.itemsPerPage"
    :footer-props="{
      'items-per-page-options': [10, 20, 50]
    }"
    :options.sync="options"
    class="mx-2"
    @update:options="updateOptions"
  >
    <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
    <template v-slot:item="{ item, headers }">
        <JobRow :job="item"/>
    </template>
  </v-data-table>
</template>

<script>
import JobRow from './BatchJobRow';

export default {
  data() {
    return {
      headers: [
        { text: "Job Name", value: "jobType", width: "25%", sortable: false },
        {
          text: "Description",
          value: "description",
          width: "35%",
          sortable: false
        },
        { text: "Creation Time",
          value: "creationTime",
          width: "20%",
          sortable: false
        },
        { text: "Progress", value: "progress", width: "10%", sortable: false},
        { text: "Result", value: "result", width: "10%", sortable: false, align:"center"}
      ],
      options: {
        page: 1,
        itemsPerPage: 10
      }
    };
  },
  methods: {
    updateOptions(dataFromEvent = {}) {
      this.$emit("updateOptions", { dataFromEvent });
    },
    changeTimeHuman(time) {
      let HumanDate = time.split(".", 1).toString();
      let HumanTime = HumanDate.split("T", 2).join(" ");
      return HumanTime;
    },
    getJobName(jobType){
      switch(jobType){
        case "extract_keywords": return "Extract Keywords";
        case "refresh_orb": return "Refresh ORB";
        case "export_companies": return "Export Companies";
        case "refresh_news": return "Refresh News";
        case "contact_finder": return "Contact Finder";
        case "linkedin_finder": return "LinkedIn Finder";
      }
      return jobType;
    }
  },
  props: {
    items: Array,
    totalResults: Number
  },
  computed:{
    additionalDataParsed: function(){

    }
  },
  components:{
    JobRow
  }
};
</script>
