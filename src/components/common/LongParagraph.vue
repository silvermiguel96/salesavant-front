<template>
  <div class="min-width-description">
    {{showMore ? text : trimText(text)}}
    <a
      v-show="!showMore && !!text &&text.length > this.maxLength"
      @click.prevent="toggle"
    >+</a>
    <a v-show="showMore && !!text && text.length > this.maxLength" @click.prevent="toggle">-</a>
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
    text: String,
    maxLength: {
      type: Number,
      default: 30
    }
  },
  methods: {
    trimText(text = "") {
      if (!!text) {
        return `${text.substring(0, this.maxLength)}${text.length > this.maxLength ? "..." : ""}`;
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

