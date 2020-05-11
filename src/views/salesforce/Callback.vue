<template></template>
<script>
import { getAuthToken } from "../../util";
export default {
  props: {
    salesavantAPI: { type: String, default: process.env.VUE_APP_REST_API_URL }
  },
  mounted() {
    let that = this;
    this.$nextTick(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const salesforceCode = urlParams.get("code");
      console.log(salesforceCode);
      fetch(this.salesavantAPI + "/oauth?jwt=" + getAuthToken(), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          serviceName: "salesforce",
          payload: { salesforceCode }
        })
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          if (data.status == "ok") {
            that.$router.push({
              path: "/account"
            });
            that.$eventBus.$emit(
              "showSnack",
              "Salesforce connection success",
              "success"
            );
          } else {
            console.log(data);
            that.$eventBus.$emit(
              "showSnack",
              "Error while setup connect with Salesforce",
              "error"
            );
          }
        })
        .catch(function(error) {
          console.log("Error:" + error.message);
        });
    });
  }
};
</script>