<template>
  <v-container fluid>
    <v-container fluid>
      <v-row no-gutters class="d-flex justify-end">
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="search"
            append-icon="filter_list"
            label="Quick Search"
            placeholder="Type a Full Name"
            hide-details
            autocomplete="off"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <div>
      <companies-table
        v-if="playlistContactCompanies"
        :items="playlistContactCompanies.companiesList"
        :totalResults="playlistContactCompanies.totalResults"
        @updateOptions="updateOptions"
      ></companies-table>

      <v-row justify="center" no-gutters>
        <v-col cols="12">
          <v-progress-linear :active="!!isLoading" color="blue" indeterminate absolute bottom query></v-progress-linear>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import CompaniesTable from "../../../companies/CompaniesTable.vue";
import ButtonMenu from "../../../common/ButtonMenu.vue";
import _get from "lodash.get";
import gql from "graphql-tag";

export default {
  components: {
    CompaniesTable
  },
  data() {
    return {
      search: "",
      isLoading: false,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: ""
      },
      playlist: {
        uid: "",
        name: "",
        description: null
      },
      playlistContactCompanies: []
    };
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
          uid: this.$route.params.playlistUid
        };
      },
      fetchPolicy: "cache-and-network"
    },
    playlistContactCompanies: {
      query: gql`
        query playlistContactCompanies(
          $playlistUid: String
          $search: String
          $sortBy: String
          $sortOrder: String
          $first: Int
          $offset: Int
        ) {
          playlistContactCompanies(
            playlistUid: $playlistUid
            search: $search
            sortBy: $sortBy
            sortOrder: $sortOrder
            first: $first
            offset: $offset
          ) {
            totalResults
            companiesList {
              uid
              name
              description
              city
              state
              country
              momentum
              numEmployees
              url
              industry
              totalScore
              totalSignals
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
            this.options.itemsPerPage
        };
      },
      skip() {
        return this.search.length > 0 && this.search.length < 2;
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network"
    }
  },
  methods: {
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.options.page = page;
      this.options.itemsPerPage = itemsPerPage;
      if (sortBy.length > 0) {
        switch (sortBy[0]) {
          case "totalScore":
            this.options.sortBy = "score";
            break;
          case "numEmployees":
            this.options.sortBy = "employees";
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
    createJob(jobType) {
      this.$eventBus.$emit("createJob", {
        jobType: jobType,
        additionalData: {
          playlist_uid: this.playlist.uid,
          playlist_name: this.playlist.name
        }
      });
      this.$eventBus.$emit(
        "showSnack",
        `Job ${jobType} enqueed successfully`,
        "success"
      );
    }
  },
  beforeCreate() {
    this.$apollo.queries.playlist;
    this.$apollo.queries.playlistCompanies;
  },
  mounted() {
    console.log(
      "playlist-companies update state ",
      this.$route.params.playlistUid
    );
  }
};
</script>
