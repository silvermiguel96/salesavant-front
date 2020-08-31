<template>
  <v-container fluid>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="12" md="6" offset-md="6" class="pa-1">
          <v-text-field
            v-model="search"
            append-icon="filter_list"
            label="Quick Search"
            placeholder="Type a Full Name"
            hide-details
            autocomplete="off"
            clearable
          ></v-text-field>
          <a @click.prevent="triggerSearch" class="body-2" color="gray--text"
            >Advanced Search</a
          >
        </v-col>
      </v-row>
    </v-container>
    <div>
      <!-- Result -->
      <contacts-table
        v-if="playlistContacts"
        :items="playlistContacts.contactsList"
        :totalResults="playlistContacts.totalResults"
        @updateOptions="updateOptions"
      ></contacts-table>
      <!-- Loading -->
      <v-row justify="center" no-gutters>
        <v-col cols="12">
          <v-progress-linear
            :active="!!isLoading"
            color="blue"
            indeterminate
            absolute
            bottom
            query
          ></v-progress-linear>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import ContactsTable from "../../../contacts/ContactsTable";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      search: "",
      isLoading: true,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: "",
      },
    };
  },
  components: {
    ContactsTable,
  },
  methods: {
    ...mapMutations([
      "resetContactSearch",
      "updateContactSearch",
      "showSearchDialog",
    ]),
    triggerSearch() {
      this.updateContactSearch({
        playlistUid: this.$route.params.playlistUid,
        displayPlaylistUid: this.playlist.name,
      });
      this.showSearchDialog("contacts");
    },
    updateOptions({
      dataFromEvent: {
        page = 1,
        itemsPerPage = 10,
        sortBy = [],
        sortDesc = [],
      },
    }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
      if (sortBy.length > 0) {
        switch (sortBy[0]) {
          case "scaleScoreAverage":
            this.options.sortBy = "scale_score_average";
            break;
          case "capitalEfficiencyScoreAverage":
            this.options.sortBy = "capital_efficiency_score_average";
            break;
          case "wolfpackScore":
            this.options.sortBy = "wolfpack_score";
            break;
          case "numberOfExits":
            this.options.sortBy = "number_of_exits";
            break;
        }
      } else {
        this.options.sortBy = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.options.sortOrder = "desc";
        } else {
          this.options.sortOrder = "asc";
        }
      } else {
        this.options.sortOrder = "";
      }
    },
  },
  apollo: {
    playlist: {
      query: gql`
        query getPlaylist($uid: String) {
          playlist(uid: $uid) {
            uid
            name
            description
            modificationTime
          }
        }
      `,
      variables() {
        return {
          uid: this.$route.params.playlistUid,
        };
      },
      fetchPolicy: "cache-and-network",
    },
    playlistContacts: {
      query: gql`
        query playlistContacts(
          $playlistUid: String
          $search: String
          $sortBy: String
          $sortOrder: String
          $first: Int
          $offset: Int
        ) {
          playlistContacts(
            playlistUid: $playlistUid
            search: $search
            sortBy: $sortBy
            sortOrder: $sortOrder
            first: $first
            offset: $offset
          ) {
            totalResults
            contactsList {
              uid
              fullName
              linkedinHandle
              scaleScoreAverage
              capitalEfficiencyScoreAverage
              wolfpackScore
              numberOfExits
              companies {
                title
                rank
                department
                isCurrent
                company {
                  uid
                  name
                }
              }
            }
          }
        }
      `,
      variables() {
        return {
          playlistUid: this.$route.params.playlistUid,
          search: this.search,
          sortBy: this.options.sortBy,
          sortOrder: this.options.sortOrder,
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage,
        };
      },
      skip() {
        return this.search.length > 0 && this.search.length < 2;
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network",
    },
  },
  beforeCreate() {
    this.$apollo.queries.playlistContacts;
  },
};
</script>
