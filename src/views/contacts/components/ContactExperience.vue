<template>
  <v-card style="height:100%;">
    <v-card-subtitle>
      <div class="headline">Experience</div>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text>
      <div class="title text-capitalize">Current experience </div>
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
    <v-card-text>
      <div class="title text-capitalize">Past experience</div>
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
      currentExperience: [],
      headersTable: [
        {
          text: "Company",
          value: "company.name",
          sortable: false,
          width: "18%"
        },
        { text: "Title", value: "title", sortable: false, width: "18%" },
        {
          text: "Deparment",
          value: "department",
          sortable: false,
          width: "12%"
        },
        {
          text: "Scale Score",
          value: "company.scaleScore",
          sortable: true,
          width: "15%"
        },
        {
          text: "Capital E.S.",
          value: "company.capitalEfficiencyScore",
          sortable: true,
          width: "15%"
        }
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
  computed: {
    // formatedItems() {
    //   return this.contact.map(function(contact) {
    //     let currentJobs = contact.companies.filter(function(job) {
    //       if (job.isCurrent) {
    //         console.log(job)
    //         return job;
    //       }
    //     });
    //     if (currentJobs.length > 0) {
    //       contact.currentOrLastJobs = currentJobs;
    //     }
    //     let otherJobs = contact.companies.filter(function(job) {
    //       if (!job.isCurrent) {
    //         return job;
    //       }
    //     });
    //     if (contact.companies.length > 1) {
    //       if (currentJobs.length == 0) {
    //         contact.currentOrLastJobs = [contact.companies[0]];
    //         contact.otherJobs = contact.companies.slice(1);
    //       } else {
    //         contact.otherJobs = otherJobs;
    //       }
    //     } else {
    //       contact.currentOrLastJobs = [];
    //       contact.otherJobs = [];
    //     }
    //     return currentExperience;
    //   });
    // }
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
