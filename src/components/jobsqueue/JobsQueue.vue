<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark>
          <v-btn icon dark @click="toggle">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Jobs Queue</v-toolbar-title>
        </v-toolbar>
      <table-jobs></table-jobs>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import TableJobs from './TableJobs.vue';

export default {
  data() {
    return {};
  },
  components: {
    TableJobs
  },
  props: {
    show: { type: Boolean, default: false }
  },
  methods: {
    toggle() {
      this.$emit("toggle", { show: !this.$props.show });
    }
  }
};
</script>