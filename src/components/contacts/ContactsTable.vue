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
      <router-link
        class="subtitle-2 font-weight-medium"
        :to="`/contacts/${item.uid}`"
      >{{ item.fullName }}</router-link>
    </template>
    <template v-slot:item.companies.title="{ item }">
      <div v-for="select in item.companies" :key="select.uid">
        <span v-if="select.isCurrent">{{ select.title }}</span>
      </div>
    </template>
    <template v-slot:item.companies.name="{ item }">
      <div v-for="select in item.companies" :key="select.uid">
        <router-link
          v-if="select.isCurrent"
          :to="`/companies/${select.company.uid}`"
        >{{ select.company.name }}</router-link>
      </div>
    </template>
    <template v-slot:item.companies.deparment="{ item }">
      <p v-if="item.companies.departament">{{ item.companies.departament || "--" }}</p>
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
      <td class="ma-0 pa-0" :colspan="headers.length">
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr v-for="job in item.companies" :key="job.uid">
                <td style="width:4%;"></td>
                <td style="width:15%;"></td>
                <td style="width:15%;">{{ job.title || "" }}</td>
                <td style="width:15%;">
                  <router-link :to="`/companies/${job.company.uid}`">{{ job.company.name || "" }}</router-link>
                </td>
                <td style="width:10%;"></td>
                <td style="width:10%;"></td>
                <td style="width:6%;">{{ job.company.scaleScore || "--" }}</td>
                <td style="width:6%;">{{ job.company.capitalEfficiencyScore || "--" }}</td>
                <td style="width:6%;">{{ job.company.capitalEfficiencyEstimate || "--" }}</td>
                <td style="width:6%;">--</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-divider></v-divider>
        <!-- </div> -->
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
          text: "Title",
          value: "companies.title",
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
          width: "6%",
          align: "left",
          sortable: true
        },
        {
          text: "C.E. Average",
          value: "capitalEfficiencyScoreAverage",
          width: "6%",
          sortable: true,
          align: "left"
        },
        {
          text: "C.E.E. Average",
          value: "capitalEfficiencyEstimateAverage",
          width: "6%",
          sortable: true,
          align: "left"
        },
        {
          text: "Number of exits",
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

