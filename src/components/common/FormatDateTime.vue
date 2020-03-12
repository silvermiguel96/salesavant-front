<template>
  <div class="d-inline">{{formatDateTime(time)}}</div>
</template>

<script>
export default {
  data() {},
  props: {
    time: Object
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
export function formatDateTime(time) {}
</script>

