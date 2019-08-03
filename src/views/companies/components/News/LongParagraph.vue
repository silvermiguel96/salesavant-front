<template>
  <div class="min-width-description">
    {{showMore ? text : trimText(text)}}
    <a
      v-show="!showMore && !!text &&text.length > 60"
      @click.prevent="toggle"
    >+</a>
    <a v-show="showMore && !!text && text.length > 60" @click.prevent="toggle">-</a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMore: false
    };
  },
  props: {
    text: String
  },
  methods: {
    trimText(text = "") {
      if (!!text) {
        return `${text.substring(0, 60)}${text.length > 60 ? "..." : ""}`;
      }
    },
    toggle() {
      this.showMore = !this.showMore;
    }
  }
};
</script>

<style scoped>
.min-width-description {
  white-space: normal;
  min-width: 230px;
}
</style>

