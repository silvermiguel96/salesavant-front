<template>
  <v-container fluid>
    <v-row no-gutters v-if="playlistCompanyComments">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="playlistCompanyComments.companyCommentsList"
          :server-items-length="playlistCompanyComments.length"
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
                <router-link :to="`/companies/${ item.company.uid}`">
                  <long-paragraph :text="item.company.name" :maxLength="35"></long-paragraph>
                </router-link>
              </td>
              <td>
                <long-paragraph :text="item.comments" :maxLength="45"></long-paragraph>
              </td>
              <td
                v-if="item.user.firstName || item.user.lastName"
              >{{item.user.firstName}} {{item.user.lastName}}</td>
              <td v-else>{{item.user.email || "--"}}</td>
              <td>{{ item.creationTime | moment(" MMMM Do YYYY")}}</td>
              <td>
                <add-comment-modal @onSave="addComment" :item="item" :btnIcon="'add_comment'" />
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
import LongParagraph from "../../../common/LongParagraph.vue";
import AddCommentModal from "../../../common/AddCommentModal.vue";
import gql from "graphql-tag";
export default {
  components: {
    LongParagraph,
    AddCommentModal
  },
  data() {
    return {
      playlistCompanyComments: {
        companyCommentsList: [],
        totalResults: 0
      },
      headers: [
        { text: "Company", value: "company", width: "20%", sortable: false },
        { text: "Comment", value: "firstName", width: "20%", sortable: false },
        { text: "User", value: "email", width: "25%", sortable: false },
        {
          text: "Creation Time",
          value: "creationTime",
          width: "25%",
          sortable: false
        },
        {
          text: "Add Comment",
          value: "action",
          width: "10%",
          align: "start",
          sortable: false
        }
      ],
      options: {
        page: 1,
        itemsPerPage: 10
      }
    };
  },
  apollo: {
    playlistCompanyComments: {
      query: gql`
        query playlistCompanyComments(
          $playlistUid: String
          $first: Int
          $offset: Int
        ) {
          playlistCompanyComments(
            playlistUid: $playlistUid
            first: $first
            offset: $offset
          ) {
            totalResults
            companyCommentsList {
              id
              comments
              user {
                firstName
                lastName
                email
              }
              creationTime
              company {
                uid
                name
              }
            }
          }
        }
      `,
      variables() {
        return {
          playlistUid: this.$route.params.playlistUid,
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
    addComment(comment) {
      console.log("comment", comment);
      if (!!comment.description && !!comment.item.company.uid) {
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
                      id
                      comments
                      user {
                        firstName
                        lastName
                        email
                      }
                      creationTime
                      company {
                        uid
                        name
                      }
                    }
                  }
                }
              `,
              // Parameters
              variables: {
                companyUid: comment.item.company.uid,
                description: comment.description
              },
              fetchPolicy: "no-cache"
            })
            .then(result => {
              console.log("result", result);
              if (!!result && !!result.data.createCompanyComment) {
                this.playlistCompanyComments.companyCommentsList = this.playlistCompanyComments.companyCommentsList.map(item => {
                  if (item.company.uid == comment.item.company.uid) {
                    item = result.data.createCompanyComment.companyComment
                  }
                  return item;
                });
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
    }
  }
};
</script>
