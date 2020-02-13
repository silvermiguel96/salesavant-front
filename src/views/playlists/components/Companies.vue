<template>
  <v-container class="pa-0" fluid>
    <v-card>
      <v-container fluid class="mx-1">
        <v-row no-gutters class="ml-2">
          <v-col cols="12" md="4"  sm="6">
          <v-card-subtitle>
              <div class="headline">Playlist</div>
              <div class="caption">Last Update: {{ changeTimeHuman(playlist.modificationTime)}}</div>
            </v-card-subtitle>
          </v-col>
          <v-col cols="12" md="8" sm="6">
            <div class="d-flex justify-md-end align-end">
              <div class="mt-3 mr-2">
                <v-btn class="text-capitalize" color="primary" outlined min-width="150" @click="createJob('export_companies')">
                  <v-icon size="18" class="mr-2">cloud_download</v-icon>
                  Export
                </v-btn>
              </div>
              <div class="mt-3 mr-2">
                <button-menu
                  :items="[
                    {
                      title: 'Companies',
                      icon: 'update',
                      callback: () => {
                        this.createJob('refresh_orb');
                      }
                    },
                    {
                      title: 'Keywords',
                      icon: 'update',
                      callback: () => {
                        this.createJob('extract_keywords');
                      }
                    }
                  ]"
                >
                  <template v-slot:label >Refresh</template>
                </button-menu>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <ApolloQuery
        :query="require('../graphql/PlaylistCompanies.gql')"
        :variables="{ 
          uid: $route.params.playlistUid, 
          first: this.itemsPerPage, 
          offset: (this.itemsPerPage * this.page) - this.itemsPerPage,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder
        }"
      >
        <template  v-slot="{ result: { loading, error, data }, isLoading }">
          <div class="apollo-example">
          <!-- Result -->
              <companies-table
                v-if="data"
                :items="data.playlistCompanies.companiesList"
                :totalResults="data.playlistCompanies.totalResults"
                @updateOptions="updateOptions"
                class="result apollo ma-2"
              ></companies-table>

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
        </template>
      </ApolloQuery>
    </v-card>
  </v-container>
</template>

<script>
import CompaniesTable from "../../../components/companies/CompaniesTable.vue";
import ButtonMenu from "../../../components/common/ButtonMenu";
import _get from "lodash.get";
import gql from "graphql-tag";
import { mapMutations } from "vuex";

export default {
  components: {
    CompaniesTable,
    ButtonMenu
  },
  data() {
    return {
      name: "",
      descending: false,
      page: 1,
      itemsPerPage: 10,
      sortBy: "",
      sortOrder: "",
      isLoading: false,
      playlist: {
        uid: "",
        name: "",
        totalScore: 0,
        description: null
      }
    };
  },
  apollo: {
    playlist: {
      query: gql`
        query getPlaylist($uid: String) {
          playlist(uid: $uid) {
            uid
            name
            totalScore
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
    }
  },
  methods: {
    ...mapMutations([
      'updateCompanySearch'
    ]),
    updateOptions({
      dataFromEvent: { page = 1, itemsPerPage = 10, sortBy = [], sortDesc = [] }
    }) {
      this.page = page;
      this.itemsPerPage = itemsPerPage;
      if (sortBy.length > 0) {
        switch (sortBy[0]) {
          case "totalScore":
            this.sortBy = "score";
            break;
          case "numEmployees":
            this.sortBy = "employees";
            break;
        }
      } else {
        this.sortBy = "";
      }
      if (sortDesc.length > 0) {
        if (sortDesc[0]) {
          this.sortOrder = "desc";
        } else {
          this.sortOrder = "asc";
        }
      } else {
        this.sortOrder = "";
      }
    },
    changeTimeHuman(time) {
      let humanDate = time.split(".", 1).toString();
      let humanTime = humanDate.split("T", 2).join(" ");
      return humanTime;
    },
    createJob(jobType) {
      this.$eventBus.$emit("createJob", {
        jobType: jobType,
        additionalData: { 
          playlist_uid: this.playlist.uid,
          playlist_name: this.playlist.name
        }
      });
      this.$eventBus.$emit("showSnack", `Job ${jobType} enqueed successfully`, "success");
    }
  },
  beforeCreate() {
    this.$apollo.query.playlist;
  },
  mounted(){
    console.log("playlist-companies update state ", this.$route.params.playlistUid);
    this.$store.commit('updateCompanySearch', {playlistUid: this.$route.params.playlistUid});
  }
};
</script>
