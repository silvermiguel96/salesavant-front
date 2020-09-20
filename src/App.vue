<template>
  <v-app>
    <v-content>
      <v-snackbar v-model="snack.show" :timeout="5000" :color="snack.color" class="mt-12" top>
        {{ snack.text }}
        <v-btn text @click="snack.show=false">Close</v-btn>
      </v-snackbar>
      <main-menu v-if="isAuthenticated"></main-menu>
      <advanced-search v-model="computedShowSearchDialog" v-if="isAuthenticated"></advanced-search>
      <router-view></router-view>
      <v-dialog v-if="isAuthenticated" v-model="waitDialog" persistent width="320">
        <v-card>
          <v-card-text class="pa-2 text-center">
            {{ waitDialogMessage }}
            <v-progress-linear indeterminate color="primary"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-speed-dial
        v-if="isAuthenticated"
        v-show="computedShowSearchButton"
        color
        direction="top"
        transition="slide-y-transition"
        absolute
        bottom
        right
      >
        <template v-slot:activator>
          <v-btn color="primary" dark fab medium>
            <v-icon>search</v-icon>
          </v-btn>
        </template>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              @click.prevent="showSearchDialog('companies')"
              v-bind="attrs"
              v-on="on"
              fab
              dark
              small
            >
              <v-icon>business</v-icon>
            </v-btn>
          </template>
          <span>Search Companies</span>
        </v-tooltip>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              @click.prevent="showSearchDialog('contacts')"
              v-bind="attrs"
              v-on="on"
              fab
              dark
              small
            >
              <v-icon>contacts</v-icon>
            </v-btn>
          </template>
          <span>Search Contacts</span>
        </v-tooltip>
      </v-speed-dial>
    </v-content>
  </v-app>
</template>

<script>
import { json } from "body-parser";
import gql from "graphql-tag";
import _get from "lodash.get";
import { mapMutations } from "vuex";

import MainMenu from "@/components/MainMenu.vue";
import AdvancedSearch from "@/views/advanced-search/AdvancedSearch";

export default {
  name: "App",
  components: {
    MainMenu,
    AdvancedSearch,
  },
  data() {
    return {
      expand: 0,
      snack: {
        show: false,
        text: "",
        color: "",
      },
      waitDialog: false,
      waitDialogMessage: "",
    };
  },
  created() {
    this.$store.commit("hideSearchDialog");
    this.$eventBus.$on("createJob", this.createJob);
    this.$eventBus.$on("createScheduledJob", this.createScheduledJob);
    this.$eventBus.$on("showSnack", this.showSnack);
    this.$eventBus.$on("hideSnack", this.hideSnack);
    this.$eventBus.$on("showWaitDialog", this.showWaitDialog);
    this.$eventBus.$on("hideWaitDialog", this.hideWaitDialog);
  },
  methods: {
    showSnack(text, color) {
      this.snack.show = true;
      this.snack.text = text;
      this.snack.color = color;
    },
    hideSnack() {
      this.snack.show = false;
      this.snack.text = "";
      this.snack.color = "";
    },
    showWaitDialog(waitDialogMessage) {
      this.waitDialog = true;
      this.waitDialogMessage = waitDialogMessage;
    },
    hideWaitDialog() {
      this.waitDialog = false;
      this.waitDialogMessage = "";
    },
    showSearchDialog(searchType) {
      this.$store.commit("showSearchDialog", searchType);
    },
    async createJob(jobData) {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $jobType: String!
            $description: String
            $additionalData: JSONString
          ) {
            createJob(
              jobType: $jobType
              description: $description
              additionalData: $additionalData
            ) {
              salesavantJob {
                uid
                creationTime
                jobType
                description
                additionalData
              }
            }
          }
        `,
        variables: {
          jobType: _get(jobData, "jobType"),
          description: _get(jobData, "description", ""),
          additionalData: jobData.additionalData
            ? JSON.stringify(jobData.additionalData)
            : "",
        },
      });
      console.log(response);
      if (
        !!response &&
        !!response.data.createJob &&
        !!response.data.createJob.salesavantJob
      ) {
        console.log("Job created");
        let onSuccess = _get(jobData, "onSuccess");
        if (onSuccess) {
          if (typeof onSuccess === "function") {
            onSuccess(response.data.createJob.salesavantJob);
          } else {
            console.log("onSuccess must be a function");
          }
        }
      } else {
        console.log("Job error");
        let onError = _get(jobData, "onError");
        if (onError) {
          if (typeof onError === "function") {
            onError(response);
          } else {
            console.log("onError must be a function");
          }
        }
      }
    },
    async createScheduledJob(jobData) {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $jobType: String!
            $periodicity: String!
            $description: String
            $additionalData: JSONString
          ) {
            createScheduledJob(
              jobType: $jobType
              periodicity: $periodicity
              description: $description
              additionalData: $additionalData
            ) {
              salesavantScheduledJob {
                uid
                creationTime
                jobType
                description
                additionalData
              }
            }
          }
        `,
        variables: {
          jobType: _get(jobData, "jobType"),
          periodicity: _get(jobData, "periodicity"),
          description: _get(jobData, "description", ""),
          additionalData: jobData.additionalData
            ? JSON.stringify(jobData.additionalData)
            : "",
        },
      });
      console.log(response);
      if (
        !!response &&
        !!response.data.createScheduledJob &&
        !!response.data.salesavantScheduledJob
      ) {
        console.log("Job created");
      }
    },
  },
  computed: {
    isAuthenticated (){
      return this.$store.state.userToken ? true : false;
    },
    computedShowSearchDialog: {
      get() {
        return this.$store.state.showSearchDialog;
      },
      set(value) {
        if (value) {
          return this.$store.commit("showSearchDialog");
        } else {
          return this.$store.commit("hideSearchDialog");
        }
      },
    },
    computedShowSearchButton() {
      return !this.$store.state.showSearchDialog;
    },
  },
};
</script>
