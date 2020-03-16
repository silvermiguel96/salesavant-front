<template>
  <div class="d-inline">{{formatDateTime(time)}}</div>
</template>

<script>
export default {
  props: {
    time: String
  },
  methods: {
    formatDateTime(time) {
      if (time) {
        let humanDate = time.split(".", 1).toString();
        let humanTime = humanDate.split("T", 2).join(" ");
        return humanTime;
      } else {
        return "--";
      }
    }
  }
};
</script>

