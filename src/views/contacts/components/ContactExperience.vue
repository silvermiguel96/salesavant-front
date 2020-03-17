<template>
  <v-card style="height:100%;">
    <v-card-subtitle>
      <div class="headline">Experience</div>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        v-if="contact"
        :headers="headersTable"
        :items="contact.companies"
        :sort-desc="[true]"
        dense
        hide-default-footer
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.title || "--"}}</td>
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
      headersTable: [
        { text: "Title", value: "title", sortable: false, width: "26%" },
        { text: "Company", value: "company.name", sortable: false, width: "22%" },
        { text: "Deparment", value: "isCurrent", sortable: false, width: "12%" },
        { text: "S.S.", value: "company.scaleScore", sortable: true , align: "left", width: "12%" },
        { text: "C.E.S.", value: "company.capitalEfficiencyScore", sortable: true, align: "left", width: "14%" },
        { text: "C.E.E.", value: "company.capitalEfficiencyEstimate", sortable: true, align: "left", width: "14%" }
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
