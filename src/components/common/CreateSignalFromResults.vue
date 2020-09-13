<template>
  <v-container fluid>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          id="button-open-signal"
          color="light-blue darken-1"
          class="text-capitalize"
          v-on="on"
          v-bind="attrs"
          block
          dark
        >
          <v-icon small>add</v-icon>save as signal
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Signal Data</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              id="field-signal-name"
              v-model="signal.name"
              label="Name"
              required
              :rules="requiredRules"
            ></v-text-field>
            <v-text-field
              id="field-signal-description"
              v-model="signal.description"
              label="Description"
            ></v-text-field>
            <v-text-field
              id="field-signal-score"
              v-model="signal.score"
              label="Score"
              required
              :rules="requiredRules"
            ></v-text-field>
            <v-text-field id="field-signal-group" v-model="signal.group" label="Group"></v-text-field>
            <v-checkbox v-model="autoUpdate" label="Auto Update"></v-checkbox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog = false">Close</v-btn>
          <v-btn id="save-signal" color="primary" class="text-capitalize" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    signal: {
      name: "",
      description: "",
      score: "",
      group: "",
    },
    requiredRules: [(v) => !!v || "this field is required"],
  }),
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.$emit("onSave", this.signal);
        this.dialog = false;
      }
    },
  },
};
</script>