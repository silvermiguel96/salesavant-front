<template>
</template>
<script>
export default {
  name: '',
  mounted() {
    this.$nextTick(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const salesforceCode = urlParams.get("code")
      console.log(salesforceCode);
    });
  },
};
</script>