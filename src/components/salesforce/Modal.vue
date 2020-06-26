<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <div class="d-flex align-center justify-center">
          <v-icon color="grey" size="20" v-bind="attrs" v-on="on" small>visibility</v-icon>
        </div>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-5" primary-title>Salesforce {{title}}</v-card-title>
        <v-card-text>
          <code class="code">{{ JSON.stringify(JSON.parse(item),null , 4) }}</code>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false
    };
  },
  props: {
    item: String,
    title: String
  }
};
</script>
<style scoped>
.code {
  color: rgba(0, 0, 0, 0.67);
  background: transparent;
  height: 0;
  font-family: sans-serif;
}
</style>