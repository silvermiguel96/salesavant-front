<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" xs="12" class="px-0">
        <v-row no-gutters class="pl-2 pl-sm-6">
          <v-col cols="12" xs="12" md="2" offset-md="8">
            <v-btn
              class="text-capitalize"
              color="primary"
              min-width="150"
              outlined
              @click="createJob('export_companies')"
            >
              <v-icon size="18" class="mr-2">cloud_download</v-icon>Export
            </v-btn>
          </v-col>
          <v-col cols="12" xs="12" md="2">
            <button-menu
              :items="[
              {
                title: 'Companies',
                icon: 'update',
                callback: () => {
                  this.createJob('refresh_companies');
                }
              },
              {
                title: 'Keywords',
                icon: 'update',
                callback: () => {
                  this.createJob('refresh_keywords');
                }
              }
            ]"
            >
              <template v-slot:label>Refresh</template>
            </button-menu>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CompaniesTable from "../../../components/companies/CompaniesTable.vue";
import ButtonMenu from "../../../components/common/ButtonMenu.vue";
import _get from "lodash.get";
import gql from "graphql-tag";
import { mapMutations } from "vuex";

export default {
  components: {
    CompaniesTable,
    ButtonMenu,
    
  },
  data() {
    return {
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
      playlistCompanies: []
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
    playlistCompanies: {
      query: gql`
        query playlistCompanies(
          $playlistUid: String
          $first: Int
          $offset: Int
          $sortBy: String
          $sortOrder: String
        ) {
          playlistCompanies(
            playlistUid: $playlistUid
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
              website
              url
              vertical
              totalScore
              totalSignals
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
            this.options.itemsPerPage,
          sortBy: this.options.sortBy,
          sortOrder: this.options.sortOrder
        };
      },
      watchLoading(isLoading, countModifier) {
        this.isLoading = isLoading;
      },
      fetchPolicy: "cache-and-network"
    }
  },
  methods: {
    ...mapMutations(["updateCompanySearch"]),
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
    this.$store.commit("updateCompanySearch", {
      playlistUid: this.$route.params.playlistUid
    });
  }
};
</script>
