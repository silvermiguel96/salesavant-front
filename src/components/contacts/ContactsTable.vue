<template>
  <v-data-table
    :headers="headers"
    :items="formatedItems"
    :server-items-length="totalResults"
    :items-per-page="options.itemsPerPage"
    :footer-props="{
      'items-per-page-options': [10, 20, 50]
    }"
    :options.sync="options"
    class="mx-2"
    @update:options="updateOptions"
    :single-expand="true"
    expanded.sync="expanded"
    item-key="uid"
    show-expand
    must-sort
  >
    <template v-slot:item.fullName="{ item }">
      <div>
        <router-link
        class="subtitle-2 font-weight-medium"
        :to="`/contacts/${item.uid}`"
      >{{ item.fullName }}</router-link>
      </div>
    </template>
    
    <template v-slot:item.companies.name="{ item }">
      <div v-for="job in item.currentOrLastJobs" :key="job.uid">
        <router-link :to="`/companies/${job.company.uid}`"
        >{{ job.company.name }}</router-link>
      </div>
    </template>
    <template v-slot:item.companies.title="{ item }">
      <div v-for="job in item.currentOrLastJobs" :key="job.uid">
        <span>{{ job.title }}</span>
      </div>
    </template>
    <template v-slot:item.companies.deparment="{ item }">
      <div v-for="job in item.currentOrLastJobs" :key="job.uid">
        <div>{{ job.department || "--" }}</div>
      </div>
    </template>
    <template v-slot:item.companies.rank="{ item }">
      <div v-for="job in item.currentOrLastJobs" :key="job.uid">
        <div>{{ job.rank || "--" }}</div>
      </div>
    </template>

    <template v-slot:item.scaleScoreAverage="{ item }">
      <div>{{ item.scaleScoreAverage || "--" }}</div>
    </template>
    <template v-slot:item.capitalEfficiencyScoreAverage="{ item }">
      <div>{{ item.capitalEfficiencyScoreAverage ? item.capitalEfficiencyScoreAverage.toLocaleString() : "--" }}</div>
    </template>
    <template v-slot:item.capitalEfficiencyEstimateAverage="{ item }">
      <div>{{ item.capitalEfficiencyEstimateAverage ? item.capitalEfficiencyEstimateAverage.toLocaleString() : "--" }}</div>
    </template>
    <template v-slot:item.numberOfExits="{ item }">
      <div v-if="item.numberOfExits">{{ item.numberOfExits || "--" }}</div>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td class="ma-0 pa-0" :colspan="headers.length">
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr v-for="job in item.otherJobs" :key="job.uid">
                <td style="width:4.5%;"></td>
                <td style="width:15%;">
                  <div></div>
                </td>
                <td style="width:15%;">
                  <div>
                    <router-link :to="`/companies/${job.company.uid}`">{{ job.company.name || "" }}</router-link>
                  </div>
                </td>
                <td style="width:15%;">
                  <div>{{ job.title || "" }}</div>
                </td> 
                <td style="width:10%;">
                  <div>{{ job.department || "--" }}</div>
                </td>
                <td style="width:10%;">
                  <div>{{ job.rank || "--" }}</div>
                </td>
                <td style="width:6%;">
                  <div>{{ job.company.scaleScore || "--" }}</div>
                </td>
                <td style="width:6%;">
                  <div>{{ job.company.capitalEfficiencyScore ? job.company.capitalEfficiencyScore.toLocaleString() : "--" }}</div>
                </td>
                <td style="width:6%;">
                  <div>{{ job.company.capitalEfficiencyEstimate ? job.company.capitalEfficiencyEstimate.toLocaleString() : "--" }}</div>
                </td>
                <td style="width:6%;">
                  <div>--</div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "", value: "data-table-expand", width: "4%" },
        {
          text: "Full Name",
          value: "fullName",
          width: "15%",
          sortable: false
        },
        {
          text: "Company",
          value: "companies.name",
          width: "15%",
          sortable: false
        },
        {
          text: "Title",
          value: "companies.title",
          width: "15%",
          sortable: false
        },
        {
          text: "Department",
          value: "companies.deparment",
          width: "10%",
          sortable: false
        },
        {
          text: "Rank",
          value: "companies.rank",
          width: "10%",
          sortable: false
        },
        {
          text: "S.S.A.",
          value: "scaleScoreAverage",
          width: "6%",
          align: "left",
          sortable: true
        },
        {
          text: "C.E.A.",
          value: "capitalEfficiencyScoreAverage",
          width: "6%",
          sortable: true,
          align: "left"
        },
        {
          text: "C.E.E.A.",
          value: "capitalEfficiencyEstimateAverage",
          width: "6%",
          sortable: true,
          align: "left"
        },
        {
          text: "Exits",
          value: "numberOfExits",
          width: "6%",
          sortable: true,
          align: "left"
        }
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
    }
  },
  computed: {
    formatedItems() {
      return this.items.map(function(contact) {
        let currentJobs = contact.companies.filter(function(job) {
          if (job.isCurrent) {
            return job;
          }
        });

        if (currentJobs.length > 0){
          contact.currentOrLastJobs = currentJobs;
        }else{
          contact.currentOrLastJobs = [contact.companies[0]];
        }

        if (contact.currentOrLastJobs.length < contact.companies.length){
          let otherJobs = contact.companies.filter(function(job) {
            if (!job.isCurrent) {
              return job;
            }
          });
          if (otherJobs.length > 0){
            contact.otherJobs = otherJobs;
          }
        }else{
          contact.otherJobs = [];  
        }
        return contact;
      });
    }
  },
  props: {
    items: Array,
    totalResults: Number
  }
};
</script>

<style scoped>
.wrapping-td {
  white-space: normal;
}
</style>

