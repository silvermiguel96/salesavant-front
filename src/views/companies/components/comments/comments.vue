<template>
  <v-card class="ma-3">
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="companyComments.companyCommentsList"
        :server-items-length="companyComments.totalResults"
        :items-per-page="options.itemsPerPage"
        :footer-props="{
          'items-per-page-options': [10, 20, 50]
        }"
        :options.sync="options"
        class="mx-2"
        @updateOptions="updateOptions"
      >
        <template v-slot:item="{ item, headers }">
          <tr>
            <td>
              <long-paragraph :text="item.comments" :maxLength="45"></long-paragraph>
            </td>
            <td>{{ item.user.email || "--" }}</td>
            <td>{{ changeTimeHuman(item.creationTime) || "--" }}</td>
            <td>--</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>

import _get from "lodash.get";
import LongParagraph from "../../../../components/common/LongParagraph.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      options: {
        page: 1,
        itemsPerPage: 10
      },
      companyComments: [],
      signalId: null,
      snack: false,
      snackColor: "",
      snackText: "",
      currentSignalSearch: null,
      descending: false,
      headers: [
        { text: "Comment", sortable: false},
        { text: "User",sortable: false},
        { text: "Creation Time", sortable: false},
        { text: "Actions", sortable: false}
      ]
    };
  },
  apollo: {
    companyComments: {
      query: gql`
        query searchCompanyComments(
          $companyUid: String
          $first: Int
          $offset: Int
        ) {
          companyComments(
            companyUid: $companyUid
            first: $first
            offset: $offset
          ) {
            totalResults
            companyCommentsList {
              id
              creationTime
              comments
              user{
                email
              }
            }
          }
        }
      `,
      variables() {
        return {
          companyUid: this.$route.params.companiesUid,
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage
        };
      },
      fetchPolicy: "cache-and-network"
    }
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = options.page;
      this.options.itemsPerPage = options.itemsPerPage;
    },
    changeTimeHuman(time) {
      let HumanDate = time.split(".", 1).toString();
      let HumanTime = HumanDate.split("T", 2).join(" ");
      return HumanTime;
    }
  },
  components: {
    LongParagraph
  },
  beforeUpdate() {
    this.$apollo.queries.companyComments;
  }
};
</script>
<style></style>
