<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" md="2" class="pa-1">
        <div class="mt-md-4">
          <button-menu
            :items="[
                  {
                    title: 'Export as CSV',
                    icon: 'cloud_download',
                    callback: () => {
                      this.createJob('export_companies');
                    }
                  },
                  {
                    title: 'Update Statistics',
                    icon: 'functions',
                    callback: () => {
                      this.createJob('playlist_aggs');
                    }
                  },
                  {
                    title: 'Refresh Companies',
                    icon: 'update',
                    callback: () => {
                      this.createJob('refresh_companies');
                    }
                  },
                  {
                    title: 'Refresh Keywords',
                    icon: 'update',
                    callback: () => {
                      this.createJob('refresh_keywords');
                    }
                  },
                ]"
            >
            <template v-slot:label>Actions</template>
          </button-menu>
        </div>
      </v-col>
      <v-col cols="12" md="6"  offset-md="4" class="pa-1">
        <v-text-field
          v-model="search"
          append-icon="filter_list"
          label="Quick Search"
          placeholder="Type a Name"
          hide-details
          autocomplete="off"
          clearable
        ></v-text-field>
        <a @click.prevent="triggerSearch" class="body-2" color="gray--text">Advanced Search</a>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <companies-table
          v-if="playlistCompanies"
          :items="playlistCompanies.companiesList"
          :totalResults="playlistCompanies.totalResults"
          @updateOptions="updateOptions"
        ></companies-table>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-progress-linear :active="!!isLoading" color="blue" indeterminate absolute bottom query></v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CompaniesTable from "../../../companies/CompaniesTable.vue";
import ButtonMenu from "../../../common/ButtonMenu.vue";
import { mapMutations } from "vuex";
import _get from "lodash.get";
import gql from "graphql-tag";

export default {
  components: {
    CompaniesTable,
    ButtonMenu,
  },
  data() {
    return {
      isLoading: false,
      search: "",
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: "",
        sortOrder: "",
      },
      playlist: {
        uid: "",
        name: "",
        description: null,
      },
      playlistCompanies: [],
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
          uid: this.$route.params.playlistUid,
        };
      },
      fetchPolicy: "cache-and-network",
    },
    playlistCompanies: {
      query: gql`
        query playlistCompanies(
          $playlistUid: String!
          $searchName: String
          $first: Int
          $offset: Int
          $sortBy: String
          $sortOrder: String
        ) {
          playlistCompanies(
            playlistUid: $playlistUid
            searchName: $searchName
            first: $first
            offset: $offset
            sortBy: $sortBy
            sortOrder: $sortOrder
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
          searchName: this.search,
          first: this.options.itemsPerPage,
          offset:
            this.options.itemsPerPage * this.options.page -
            this.options.itemsPerPage,
          sortBy: this.options.sortBy,
          sortOrder: this.options.sortOrder,
        };
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network",
    },
  },
  methods: {
    ...mapMutations([
      "resetCompanySearch",
      "updateCompanySearch",
      "showSearchDialog",
    ]),
    triggerSearch() {
      this.updateCompanySearch({
        playlistUid: this.$route.params.playlistUid,
        displayPlaylistUid: this.playlist.name,
      });
      this.showSearchDialog("companies");
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
          playlist_name: this.playlist.name,
        },
      });
      this.$eventBus.$emit(
        "showSnack",
        `Job ${jobType} enqueed successfully`,
        "success"
      );
    },
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
  },
};
</script>
