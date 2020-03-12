<template>
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
    :single-expand="true"
    expanded.sync="expanded"
    item-key="uid"
    show-expand
  >
    <template v-slot:item.fullName="{ item }">
      <div>
        <router-link
          class="subtitle-2 font-weight-medium"
          :to="`/contacts/${ item.uid}`"
        >{{ item.fullName}}</router-link>
      </div>
      <div>
        <v-icon>link</v-icon>
        <a
          :href="`https://linkedin.com/in/${item.linkedinHandle}`"
          target="_blank"
        >{{ item.linkedinHandle }}</a>
      </div>
    </template>
    <template v-slot:item.companies.title="{ item }">
      <div v-for="select in item.companies" :key="select.uid">
        <span v-if="select.isCurrent">{{ select.title }}</span>
      </div>
      <div v-for="select in item.companies" :key="select.uid">
        <span v-if="select.isCurrent">{{ select.company.name }}</span>
      </div>
    </template>
    <template v-slot:item.companies.deparment="{ item }">
      <p v-if="item.companies.departament">{{ item.companies.departament || "--"}}</p>
      <p v-else>--</p>
    </template>
    <template v-slot:item.companies.rank="{ item }">
      <p v-if="item.companies.rank">{{ item.companies.rank }}</p>
      <p v-else>--</p>
    </template>
    <template v-slot:item.scaleScoreAverage="{ item }">
      <p v-if="item.scaleScoreAverage">{{ item.scaleScoreAverage }}</p>
      <p v-else>--</p>
    </template>
    <template v-slot:item.capitalEfficiencyScoreAverage="{ item }">
      <p v-if="item.capitalEfficiencyScoreAverage">{{ item.capitalEfficiencyScoreAverage }}</p>
      <p v-else>--</p>
    </template>
    <template v-slot:item.capitalEfficiencyEstimateAverage="{ item }">
      <p v-if="item.capitalEfficiencyEstimateAverage">{{ item.capitalEfficiencyEstimateAverage }}</p>
      <p v-else>--</p>
    </template>
    <template v-slot:item.numberOfExits="{ item }">
      <p v-if="item.numberOfExits">{{ item.numberOfExits }}</p>
      <p v-else>--</p>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <div class="ma-3" v-for="job in item.companies" :key="job.uid">
          <v-row no-gutters>
            <v-col cols="3"></v-col>
            <v-col cols="2">
              <div>{{ job.title }}</div>
              {{ job.company.name }}
            </v-col>
            <v-col cols="3"></v-col>
            <v-col cols="1">
              <div class="text-center pr-2">{{ job.company.scaleScore }}</div>
            </v-col>
            <v-col cols="1">
              <div class="text-end pr-4">{{ job.company.capitalEfficiencyScore }}</div>
            </v-col>
            <v-col cols="1">
              <div class="text-end">{{ job.company.capitalEfficiencyEstimate }}</div>
            </v-col>
            <v-col cols="1">
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </div>
      </td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "Full Name/Linkedin",
          value: "fullName",
          width: "20%",
          sortable: false
        },
        {
          text: "Title/Company",
          value: "companies.title",
          width: "20%",
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
          text: "Scale Score Average",
          value: "scaleScoreAverage",
          width: "11%",
          align: "right",
          sortable: true
        },
        {
          text: "C.E. Average",
          value: "capitalEfficiencyScoreAverage",
          width: "10%",
          sortable: true,
          align: "right"
        },
        {
          text: "C.E.E. Average",
          value: "capitalEfficiencyEstimateAverage",
          width: "10%",
          sortable: true,
          align: "right"
        },
        {
          text: "Number of exits",
          value: "numberOfExits",
          width: "9%",
          sortable: true,
          align: "right"
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

