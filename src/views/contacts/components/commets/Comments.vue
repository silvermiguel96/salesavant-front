<template>
  <v-card>
    <v-container fluid class="mx-1">
      <v-row no-gutters class="ml-2">
        <v-col cols="12" md="4"></v-col>
        <v-col cols="12" md="8">
          <div class="d-flex justify-md-end">
            <div class="mt-3 mr-2">
              <add-modal @onSave="saveComment" />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-card-text v-if="contactComments">
      <v-data-table
        :headers="headers"
        :items="contactComments.contactCommentsList"
        :server-items-length="contactComments.totalResults"
        :items-per-page="options.itemsPerPage"
        :footer-props="{
          'items-per-page-options': [10, 20, 50]
        }"
        :options.sync="options"
        class="mx-2"
        @updateOptions="updateOptions"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <long-paragraph :text="item.comments" :maxLength="45"></long-paragraph>
            </td>
            <td
              v-if="item.user.firstName || item.user.lastName"
            >{{item.user.firstName}} {{item.user.lastName}}</td>
            <td v-else>{{item.user.email || "--"}}</td>
            <td>
              <format-date-time :time="item.creationTime" />
            </td>
            <td>
              <div class="d-flex align-center justify-center">
                <v-icon color="red lighten-2" small @click="deleteComment(item)">delete</v-icon>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import FormatDateTime from "../../../../components/common/FormatDateTime.vue";
import LongParagraph from "../../../../components/common/LongParagraph.vue";
import AddModal from "./components/AddModal.vue";
import _get from "lodash.get";
import gql from "graphql-tag";
export default {
  data() {
    return {
      dialog: false,
      contactComments: null,
      headers: [
        { text: "Comment", sortable: false },
        { text: "User", sortable: false },
        { text: "Creation Time", sortable: false },
        { text: "Remove", align: "center", sortable: false }
      ],
      options: {
        page: 1,
        itemsPerPage: 10
      }
    };
  },
  apollo: {
    contactComments: {
      query: gql`
        query contactComments($contactUid: String, $first: Int, $offset: Int) {
          contactComments(
            contactUid: $contactUid
            first: $first
            offset: $offset
          ) {
            totalResults
            contactCommentsList {
              id
              creationTime
              comments
              user {
                email
                firstName
                lastName
              }
            }
          }
        }
      `,
      variables() {
        return {
          contactUid: this.$route.params.contactUid,
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
    saveComment(description = null) {
      if (!!description) {
        try {
          this.$apollo
            .mutate({
              mutation: gql`
                mutation($contactUid: String!, $description: String!) {
                  createContactComment(
                    contactUid: $contactUid
                    description: $description
                  ) {
                    contactComment {
                      id
                      creationTime
                      comments
                      user {
                        email
                        firstName
                        lastName
                      }
                    }
                  }
                }
              `,
              // Parameters
              variables: {
                contactUid: this.$route.params.contactUid,
                description: description
              },
              fetchPolicy: "no-cache"
            })
            .then(result => {
              console.log("result", result);
              if (!!result && !!result.data.createContactComment) {
                this.contactComments.totalResults += 1;
                this.contactComments.contactCommentsList.push(
                  result.data.createContactComment.contactComment
                );
                console.log(
                  "this.contactComments.totalResults",
                  this.contactComments.totalResults
                );
                console.log(
                  "this.contactComments.contactCommentsList",
                  this.contactComments.contactCommentsList
                );
                this.$eventBus.$emit(
                  "showSnack",
                  "New comment successfully created!!",
                  "success"
                );
              }
            });
        } catch (error) {
          console.log("error saving simple search as a commet list", error);
          this.$eventBus.$emit(
            "showSnack",
            "Error in save new comment!!",
            "error"
          );
        }
      }
    },

    async deleteComment(comment) {
      console.log("comment", comment);
      const res = await this.$confirm(
        `<h1 class="subtitle-1">
              Confirm you want to eliminate the comment
              <span class="font-weight-bold"
              >${comment.comments}</span>?
            </h1> `,
        {
          buttonTrueText: "delete",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "primary",
          icon: "delete",
          title: "Delete Comment",
          width: 600
        }
      );
      if (res) {
        try {
          const index = this.contactComments.contactCommentsList.indexOf(
            comment
          );
          const result = await this.$apollo.mutate({
            mutation: gql`
              mutation($commentId: Int!) {
                deleteContactComment(contactCommentId: $commentId) {
                  contactComment {
                    id
                    comments
                  }
                }
              }
            `,
            // Parameters
            variables: {
              commentId: parseInt(comment.id)
            }
          });
          console.log("result", result);
          this.contactComments.contactCommentsList.splice(index, 1);
          console.log(this.$apollo.queries);
          this.$eventBus.$emit(
            "showSnack",
            "The comment successfully delete!!",
            "success"
          );
          this.dialog = false;
        } catch (error) {
          console.log("error", error);
          this.$eventBus.$emit(
            "showSnack",
            "Error in delete comments!!",
            "error"
          );
        }
      }
    }
  },
  components: {
    LongParagraph,
    AddModal,
    FormatDateTime
  },
  beforeUpdate() {
    this.$apollo.queries.contactComments;
  }
};
</script>
<style></style>
