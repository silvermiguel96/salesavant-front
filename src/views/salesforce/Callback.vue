<template>
  <v-container fluid>
    <v-card class="d-flex flex-column align-center mx-auto py-4" max-width="600" outlined>
      <div class="title text-secondary">Connect to Salesforce</div>
      <div class="d-flex flex-row justify-space-between my-8">
        <v-img :src="require('../../assets/salesavant_logo_w.png')" width="140" contain></v-img>
        <v-icon class="mx-md-8 mx-2" color="primary">swap_horizontal_circle</v-icon>
        <v-img :src="require('../../assets/salesforce_logo.png')" width="140"></v-img>
      </div>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-card>
  </v-container>
</template>
<script>
import { getAuthToken } from "../../util";
import { mapMutations } from "vuex";
export default {
  props: {
    salesavantAPI: { type: String, default: process.env.VUE_APP_REST_API_URL }
  },
  methods: {
    ...mapMutations(["setSalesforceWizardStep", "setSalesforceWizardConnectionId"])
  },
  mounted() {
    let that = this;
    this.$nextTick(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const salesforceCode = urlParams.get("code");
      console.log(salesforceCode);
      fetch(this.salesavantAPI + "/oauth/salesforce?jwt=" + getAuthToken(), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          payload: { salesforceCode }
        })
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log(data);
          if (data.status == "ok") {
            that.setSalesforceWizardConnectionId(data.salesforceConnectionId);
            that.setSalesforceWizardStep(2);
          } else {
            that.setSalesforceSetupStep(1);
            that.$eventBus.$emit(
              "showSnack",
              "Error while setup connecting to Salesforce",
              "error"
            );
          }
        })
        .catch(function(error) {
          console.log("Error:" + error.message);
          that.setSalesforceSetupStep(1);
        });
      setTimeout(function() {
        that.$router.push({
          path: "/salesforce-setup"
        });
      }, 1000);
    });
  }
};
</script>