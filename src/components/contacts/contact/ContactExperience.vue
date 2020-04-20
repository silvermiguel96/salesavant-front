<template>
  <v-card style="height:100%;" class="pa-3">
    <div v-if="contact">
      <v-card-text>
        <div>
          <div class="title text-capitalize font-weight-regular grey--text">Current experience</div>
          <v-data-table
            :headers="headersTable"
            :items="currentExperience"
            :sort-desc="[true]"
            :hide-default-footer="currentExperience.length >= 5 ? false : true"
            :footer-props="{
          'items-per-page-options': [5]
        }"
            dense
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <div>
                    <router-link
                      :to="`/companies/${item.company.uid}`"
                    >{{ item.company.name || "" }}</router-link>
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
        </div>

        <div class="mt-2">
          <div class="title text-capitalize font-weight-regular grey--text">Past experience</div>
          <v-data-table
            :headers="headersTable"
            :items="pastExperience"
            :sort-desc="[true]"
            :hide-default-footer="pastExperience.length >= 5 ? false : true"
            :footer-props="{
          'items-per-page-options': [5]
        }"
            dense
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <div>
                    <router-link
                      :to="`/companies/${item.company.uid}`"
                    >{{ item.company.name || "" }}</router-link>
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
        </div>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
import gql from "graphql-tag";

export default {
  data() {
    return {
      contact: null,
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
    currentExperience: function() {
      return this.contact.companies.filter(function(job) {
        if (job.isCurrent) {
          return job;
        }
      });
    },
    pastExperience: function() {
      return this.contact.companies.filter(function(job) {
        if (!job.isCurrent) {
          return job;
        }
      });
    }
  }
};
</script>

<style scoped>
.v-card__text {
  padding: 0.5em;
  padding-left: 1em;
}
</style>
