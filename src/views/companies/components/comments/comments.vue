<template>
  <v-container fluid>
    <v-row no-gutters class="ml-2">
      <v-col cols="12">
        <div class="d-flex justify-md-end">
          <div class="mt-3 mr-2">
            <add-modal @onSave="saveComments" />
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="companyComments">
      <v-col cols="12">
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
          <template v-slot:item="{ item }">
            <tr>
              <td>
                <long-paragraph :text="item.comments" :maxLength="45"></long-paragraph>
              </td>
              <td
                v-if="item.user.firstName || item.user.lastName"
              >{{item.user.firstName}} {{item.user.lastName}}</td>
              <td v-else>{{item.user.email || "--"}}</td>
              <td>{{ item.creationTime | moment(" MMMM Do YYYY")}}</td>
              <td>
                <div class="d-flex align-center justify-center">
                  <v-icon color="red lighten-2" small @click="deleteComment(item)">delete</v-icon>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _get from "lodash.get";
import LongParagraph from "../../../../components/common/LongParagraph.vue";
import AddModal from "./components/addModal.vue";
import gql from "graphql-tag";
export default {
  data() {
    return {
      companyComments: null,
      headers: [
        { text: "Comment", value: "firstName",  width: "40%", sortable: false },
        { text: "User", value: "email", width: "25%", sortable: false },
        { text: "Creation Time", value: "creationTime", width: "25%", sortable: false },
        { text: "Remove", value: "action", width: "10%", align: "center", sortable: false }
      ],
      options: {
        page: 1,
        itemsPerPage: 10
      }
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
                firstName
                lastName
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
    saveComments(description = null) {
      console.log("description", description);
      if (!!description) {
        try {
          this.$apollo
            .mutate({
              mutation: gql`
                mutation($companyUid: String!, $description: String!) {
                  createCompanyComment(
                    companyUid: $companyUid
                    description: $description
                  ) {
                    companyComment {
                      creationTime
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
                companyUid: this.$route.params.companiesUid,
                description: description
              },
              fetchPolicy: "no-cache"
            })
            .then(result => {
              console.log("result", result);
              if (!!result && !!result.data.createCompanyComment) {
                this.companyComments.totalResults += 1;
                this.companyComments.companyCommentsList.push(
                  result.data.createCompanyComment.companyComment
                );
                console.log(
                  "this.companyComments.totalResults",
                  this.companyComments.totalResults
                );
                console.log(
                  "this.companyComments.companyCommentsList",
                  this.companyComments.companyCommentsList
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
          const index = this.companyComments.companyCommentsList.indexOf(
            comment
          );
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
              commentId: parseInt(comment.id)
            }
          });
          console.log("result", result);
          this.companyComments.companyCommentsList.splice(index, 1);
          this.companyComments.totalResults -= 1;
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
            "Error in delete comment!!",
            "error"
          );
        }
      }
    }
  },
  components: {
    LongParagraph,
    AddModal
  },
  beforeUpdate() {
    this.$apollo.queries.companyComments;
  }
};
</script>
