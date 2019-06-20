<template>
  <div>
    <p>Loading...</p>
  </div>
</template>

<script>
import { onLogin } from "../vue-apollo";
export default {
  methods: {
    handleLoginEvent(data) {
      this.$router.push(data.state.target || "/");
    }
  },
  async created() {
    try {
      console.log("this.$apolloProvider", this.$apolloProvider);
      console.log("this.$apollo", this.$apollo);
      const token = await this.$auth.handleAuthentication();
      console.log({ token });
      await onLogin(this.$apolloProvider.defaultClient, token);
    } catch (error) {
      console.log("callback.vue, apollo onLogin Error");
      console.log(error);
    }
  }
};
</script>