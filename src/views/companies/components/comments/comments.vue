<template>
  <v-card >
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Delete comment</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <h1 class="subtitle-1">
              Confirm you want to eliminate the comment
              <span
                class="font-weight-bold"
              >{{selectedComment.comments}}</span>?
            </h1>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog = false">Close</v-btn>
          <v-btn
            color="red darken-1"
            class="text-capitalize"
            text
            @click="deleteComment(selectedCommentId)"
          >Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card-text></v-card-text>
    <v-container fluid class="mx-1">
      <v-row no-gutters class="ml-2">
        <v-col cols="12" md="4"></v-col>
        <v-col cols="12" md="8">
          <div class="d-flex justify-md-end">
            <div class="mt-3 mr-2">
              <add-modal @onSave="saveComments" />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
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
            <td><format-date-time :time="item.creationTime" /></td>
            <td>
              <div class="d-flex align-center justify-center">
                <v-icon
                  color="red lighten-2"
                  small
                  @click="selectComment({
                  item: item,
                  commentsId: item.id
              })"
                >delete</v-icon>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import formatDateTime from "../../../../components/common/FormatDateTime.vue"
import _get from "lodash.get";
import LongParagraph from "../../../../components/common/LongParagraph.vue";
import AddModal from "./components/addModal.vue";
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
      currentSignalSearch: null,
      descending: false,
      headers: [
        { text: "Comment", sortable: false },
        { text: "User", sortable: false },
        { text: "Creation Time", sortable: false },
        { text: "Remove", align: "center", sortable: false }
      ],
      dialog: false,
      selectedComment: "",
      selectedCommentId: {}
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
              user {
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
          offset: this.options.itemsPerPage * this.options.page - this.options.itemsPerPage
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
    refreshData() {
      this.$apollo.queries.companyComments.refresh();
    },
    async saveComments(description = null) {
      console.log("description", description);
      if (!!description) {
        try {
          const result = await this.$apollo.mutate({
            mutation: gql`
              mutation($companyUid: String!, $description: String!) {
                createCompanyComment(
                  companyUid: $companyUid
                  description: $description
                ) {
                  companyComment {
                    creationTime
                    id
                    comments
                  }
                }
              }
            `,
            // Parameters
            variables: {
              companyUid: this.$route.params.companiesUid,
              description: description
            }
          });
          this.$eventBus.$emit(
            "showSnack",
            "New comment successfully created!!",
            "success"
          );
          console.log("saving result comments", result);
          this.refreshData();
          return;
        } catch (error) {
          console.log("error saving simple search as a commet list", error);
        }
      }
    },
    selectComment({ item, commentsId }) {
      this.selectedComment = item;
      this.selectedCommentId = commentsId;
      this.dialog = true;
    },
    async deleteComment(selectedCommentId) {
      console.log("selectedCommentId", selectedCommentId);
      try {
        if (!selectedCommentId) {
          this.$eventBus.$emit(
            "showSnack",
            "Error in delete comments!!",
            "error"
          );
          return;
        }
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation($commentId: Int!) {
              deleteCompanyComment(companyCommentId: $commentId) {
                companyComment {
                  id
                  comments
                }
              }
            }
          `,
          // Parameters
          variables: {
            commentId: selectedCommentId
          }
        });
        console.log("result", result);
        this.$eventBus.$emit(
          "showSnack",
          "The comment successfully delete!!",
          "success"
        );
        this.dialog = false;
        this.refreshData();
      } catch (error) {
        this.$eventBus.$emit(
          "showSnack",
          "Error in delete comments!!",
          "error"
        );
      }
    }
  },
  components: {
    LongParagraph,
    AddModal,
    formatDateTime
  },
  beforeUpdate() {
    this.$apollo.queries.companyComments;
  }
};
</script>
<style></style>
