<template>
  <v-app>
    <v-content>
      <v-snackbar v-model="snack.show" :timeout="10000" :color="snack.color" class="mt-12" top>
        {{ snack.text }}
        <v-btn text @click="snack = false">Close</v-btn>
      </v-snackbar>
      <main-menu v-if="isAuthenticated"></main-menu>
      <advanced-search
        v-if="isAuthenticated"
        v-model="showSearchDialog"
        :expand="expand"
      ></advanced-search>
      <router-view @createJob="createJob" @showSnack="showSnack"></router-view>
    </v-content>
  </v-app>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import AdvancedSearch from "./views/advanced-search/AdvancedSearch";
import { json } from "body-parser";
import { AUTH_TOKEN } from './vue-apollo';
import gql from "graphql-tag";
import _get from "lodash.get";
import { mapMutations } from "vuex";

export default {
  name: "App",
  components: {
    MainMenu,
    AdvancedSearch
  },
  data() {
    return {
      isAuthenticated: false,
      expand: 0,
      snack: {
        show: false,
        text: "",
        color: ""
      }
    };
  },
  created() {
    if (!!localStorage.getItem(AUTH_TOKEN)) {
      this.isAuthenticated = true;
      this.$store.commit("hideSearchDialog");
      console.log("AUTH_TOKEN", AUTH_TOKEN);
    }
  },
  methods: {
    ...mapMutations([
      "showSearchDialog",
      "hideSearchDialog"
    ]),
    showSnack(text, color){
      this.snack.show = true;
      this.snack.text = text;
      this.snack.color = color;
    },
    hideSnack(){
      this.snack.show = false;
      this.snack.text = "";
      this.snack.color = "";
    },
    async createJob(jobData){
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($jobType: String!, $description: String, $additionalData: JSONString) {
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
          additionalData: jobData.additionalData ? JSON.stringify(jobData.additionalData): ""
        }
      });
    }
  },
  computed: {
    showSearchDialog :{
      get () {
        return this.$store.state.advancedSearch.showDialog;
      },
      set (value) {
        if (value){
          return this.$store.commit("showSearchDialog");
        }else{
          return this.$store.commit("hideSearchDialog");
        }
      }
    },
  }
};
</script>
