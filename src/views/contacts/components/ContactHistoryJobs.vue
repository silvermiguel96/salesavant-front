<template>
  <v-card style="height:100%;">
    <v-card-subtitle>
      <div class="headline">History Jobs</div>
      <div class="caption">
        Last update :
        <format-date-time :time="contact.modificationTime" />
      </div>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        v-if="contact"
        :headers="headersTable1"
        :items="contact.companies"
        :sort-desc="[true]"
        dense
        hide-default-footer
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{item.title}}</td>
            <td>{{ item.company.name || "--" }}</td>
            <td v-if="item.isCurrent">
              <v-icon color="green">check_circle</v-icon>
            </td>
            <td v-else>--</td>
            <td class="text-end">{{ item.company.scaleScore || "0"}}</td>
            <td class="text-end">{{ item.company.capitalEfficiencyScore || "0"}}</td>
            <td class="text-end">{{ item.company.capitalEfficiencyEstimate || "0"}}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import formatDateTime from "../../../components/common/FormatDateTime.vue";
import gql from "graphql-tag";

export default {
  data() {
    return {
      contact: [],
      headersTable1: [
        { text: "Title", value: "title", sortable: false },
        { text: "Company", value: "company.name", sortable: false },
        { text: "Deparment", value: "isCurrent", sortable: false },
        { text: "Scale score", value: "company.scaleScore", sortable: false , align: "right"},
        { text: "Capital Efficiency Score", value: "company.capitalEfficiencyScore", sortable: false, align: "right" },
        { text: "Capital Efficiency Estimate", value: "company.capitalEfficiencyEstimate", sortable: false, align: "right" }
      ]
    };
  },
  components: {
    formatDateTime
  },
  apollo: {
    contact: {
      query: gql`
        query contactOne($uid: String) {
          contact(uid: $uid) {
            creationTime
            modificationTime
            uid
            fullName
            personalEmail
            personalPhone
            bio
            companies {
              title
              departament
              company {
                name
                scaleScore
                capitalEfficiencyScore
                capitalEfficiencyEstimate
              }
            }
          }
        }
      `,
      variables() {
        return {
          uid: this.$route.params.contactUid
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  beforeCreate() {
    this.$apollo.queries.contact;
  }
};
</script>

<style scoped>
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
</style>
