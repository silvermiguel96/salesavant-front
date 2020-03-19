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
            <td>
              <div>
                <router-link :to="`/companies/${item.company.uid}`">{{ item.company.name || "" }}</router-link>
                <v-icon v-if="item.isCurrent" size="12" color="green darken-1">check_circle</v-icon>
              </div>
            </td>
            <td>
              <div>{{ item.title || "--" }}</div>
            </td>
            <td>
              <div>{{ item.department || "--" }}</div>
            </td>
            <td>
              <div>{{ item.company.scaleScore || "--" }}</div>
            </td>
            <td>
              <div>{{ item.company.capitalEfficiencyScore || "--" }}</div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import gql from "graphql-tag";

export default {
  data() {
    return {
      contact: [],
      headersTable: [
        { text: "Company", value: "company.name", sortable: false, width: "18%" },
        { text: "Title", value: "title", sortable: false, width: "18%" },
        { text: "Deparment", value: "department", sortable: false, width: "12%" },
        { text: "Scale Score", value: "company.scaleScore", sortable: true, width: "15%" },
        { text: "Capital E.S.", value: "company.capitalEfficiencyScore", sortable: true, width: "15%" },
      ]
    };
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
              department
              isCurrent
              company {
                uid
                name
                scaleScore
                capitalEfficiencyScore
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
