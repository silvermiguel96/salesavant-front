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
    </v-content>
  </v-app>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import AdvancedSearch from "./views/advanced-search/AdvancedSearch";
import { json } from "body-parser";
import { AUTH_TOKEN } from "./util";
import gql from "graphql-tag";
import _get from "lodash.get";
import { mapMutations } from "vuex";

export default {
  name: "App",
  components: {
    MainMenu,
    AdvancedSearch,
  },
  data() {
    return {
      isAuthenticated: false,
      expand: 0,
      snack: {
        show: false,
        text: "",
        color: "",
      },
    };
  },
  created() {
    if (!!localStorage.getItem(AUTH_TOKEN)) {
      this.isAuthenticated = true;
      this.$store.commit("hideSearchDialog");
    }
    this.$eventBus.$on("createJob", this.createJob);
    this.$eventBus.$on("createScheduledJob", this.createScheduledJob);
    this.$eventBus.$on("showSnack", this.showSnack);
    this.$eventBus.$on("hideSnack", this.hideSnack);
  },
  methods: {
    ...mapMutations(["showSearchDialog", "hideSearchDialog"]),
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
  },
};
</script>
