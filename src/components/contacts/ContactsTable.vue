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
    <template v-slot:item="{ item, expand, isExpanded }">
      <tr>
        <td>
          <v-icon
            v-if="item.otherJobs.length >= 1 && isExpanded == false"
            @click="expand(!isExpanded)"
          >expand_more</v-icon>
          <v-icon v-if="isExpanded == true" @click="expand(!isExpanded)">expand_less</v-icon>
        </td>
        <td>
          <router-link
            :to="`/contacts/${item.uid}`"
          >{{ item.fullName }}</router-link>
        </td>
        <td>
          <div v-for="job in item.currentOrLastJobs" :key="job.uid">
            <router-link :to="`/companies/${job.company.uid}`">{{ job.company.name }}</router-link>
            <v-icon v-if="job.isCurrent" size="12" color="green darken-1">check_circle</v-icon>
          </div>
        </td>
        <td>
          <div v-for="job in item.currentOrLastJobs" :key="job.uid">
            <span>{{ job.title }}</span>
          </div>
        </td>
        <td>
          <div v-for="job in item.currentOrLastJobs" :key="job.uid">
            <div>{{ job.department || "--" }}</div>
          </div>
        </td>
        <td>
          <div v-for="job in item.currentOrLastJobs" :key="job.uid">
            <div>{{ job.rank || "--" }}</div>
          </div>
        </td>
        <td>
          <div>{{ item.scaleScoreAverage || "--" }}</div>
        </td>
        <td>
          <div>{{ item.capitalEfficiencyScoreAverage ? item.capitalEfficiencyScoreAverage.toLocaleString() : "--" }}</div>
        </td>
        <td>
          <div>{{ item.wolfpackScore ? item.wolfpackScore.toLocaleString() : "--" }}</div>
        </td>
        <td>
          <div>{{ item.numberOfExits || "--" }}</div>
        </td>
      </tr>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td class="ma-0 pa-0" :style="{ height: '10px' }" :colspan="headers.length">
        <v-card class="ma-0 pa-0" elevation="5">
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr v-for="job in item.otherJobs" :key="job.uid">
                  <td style="width:4.5%;"></td>
                  <td style="width:15%;">
                    <div></div>
                  </td>
                  <td style="width:15%;">
                    <div>
                      <router-link
                        :to="`/companies/${job.company.uid}`"
                      >{{ job.company.name || "" }}</router-link>
                    </div>
                  </td>
                  <td style="width:15%;">
                    <long-paragraph
                      class="font-weight-light text-justify pa-0 ma-0"
                      :text="job.title"
                      :maxLength="17"
                    ></long-paragraph>
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
                    <div>--</div>
                  </td>
                  <td style="width:6%;">
                    <div>--</div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import LongParagraph from "../../components/common/LongParagraph.vue";
export default {
  data() {
    return {
      headers: [
        { text: "", value: "data-table-expand", width: "4%" },
        {
          text: "Full Name",
          value: "fullName",
          width: "15%",
          sortable: false,
        },
        {
          text: "Company",
          value: "companies.name",
          width: "15%",
          sortable: false,
        },
        {
          text: "Title",
          value: "companies.title",
          width: "15%",
          sortable: false,
        },
        {
          text: "Department",
          value: "companies.deparment",
          width: "10%",
          sortable: false,
        },
        {
          text: "Rank",
          value: "companies.rank",
          width: "10%",
          sortable: false,
        },
        {
          text: "Scale Score",
          value: "scaleScoreAverage",
          width: "6%",
          align: "left",
          sortable: true,
        },
        {
          text: "Capital E.S.",
          value: "capitalEfficiencyScoreAverage",
          width: "6%",
          sortable: true,
          align: "left",
        },
        {
          text: "Wolfpack Score",
          value: "wolfpackScore",
          width: "6%",
          sortable: true,
          align: "left",
        },
        {
          text: "Exits",
          value: "numberOfExits",
          width: "6%",
          sortable: true,
          align: "left",
        },
      ],
      options: {
        page: 1,
        itemsPerPage: 10,
      },
    };
  },
  components: {
    LongParagraph,
  },
  methods: {
    updateOptions(dataFromEvent = {}) {
      this.$emit("updateOptions", { dataFromEvent });
    },
  },
  computed: {
    formatedItems() {
      return this.items.map(function (contact) {
        let currentJobs = contact.companies.filter(function (job) {
          if (job.isCurrent) {
            return job;
          }
        });
        if (currentJobs.length > 0) {
          contact.currentOrLastJobs = currentJobs;
        }
        let otherJobs = contact.companies.filter(function (job) {
          if (!job.isCurrent) {
            return job;
          }
        });
        if (contact.companies.length >= 1) {
          if (currentJobs.length == 0) {
            contact.currentOrLastJobs = [contact.companies[0]];
            contact.otherJobs = contact.companies.slice(1);
          } else {
            contact.otherJobs = otherJobs;
          }
        } else {
          contact.currentOrLastJobs = [];
          contact.otherJobs = [];
        }
        return contact;
      });
    },
  },
  props: {
    items: Array,
    totalResults: Number,
  },
};
</script>

<style scoped>
.wrapping-td {
  white-space: normal;
}
</style>

