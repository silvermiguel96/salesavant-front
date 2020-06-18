<template>
  <v-container fluid>
    <v-card class="d-flex flex-column align-center mx-auto py-4" max-width="600" outlined>
      <div class="title text-secondary">Connect to Salesforce</div>
      <div class="d-flex flex-row justify-space-between my-8" >
        <v-img :src="require('../../assets/salesavant_logo_w.png')" width="140" contain ></v-img>
        <v-icon class="mx-md-8 mx-2" color="primary">swap_horizontal_circle</v-icon>
        <v-img :src="require('../../assets/salesforce_logo.png')" width="140"></v-img>
      </div>
      <v-btn color="primary" @click.prevent="auth">Login with Salesforce</v-btn>
    </v-card>
  </v-container>
</template>
<script>
import getParameterByName from "../../commons";
import gql from "graphql-tag";
export default {
  data() {
    return {
      salesforceOauthUrl: null
    };
  },
  methods:{
    auth() {
      window.location.href = this.salesforceOauthUrl;
    }
  },
  mounted() {
    const query = gql`
        query getSalesforceOauthUrl {
          config(key:"salesforce_oauth_url")
        }
      `;
      this.$apollo
        .query({
          query: query,
          fetchPolicy: "no-cache"
        })
        .then(resp => {
          if (!!resp.data && !!resp.data.config) {
            this.salesforceOauthUrl = resp.data.config;
          }
        });
  },
};
</script>