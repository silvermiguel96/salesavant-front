<template>
  <v-layout>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" class="text-capitalize" block v-on="on">
          <v-icon small>add</v-icon>save as signal
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Signal data</v-card-title>
        <v-card-text>
          <v-form v-model="isReady">
            <v-container grid-list-xs>
              <v-layout column>
                <v-flex xs12>
                  <v-text-field v-model="signal.name" label="Name" required :rules="requiredRules"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="signal.description" label="Description"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="signal.score"
                    label="Score"
                    required
                    :rules="requiredRules"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="signal.group" label="Group"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog = false">Close</v-btn>
          <v-btn color="green darken-1" class="text-capitalize" :disabled="!isReady" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    signal: {
      name: "",
      description: "",
      score: "",
      group: ""
    },
    requiredRules: [v => !!v || "this field is required"],
    isReady: false
  }),
  methods: {
    save() {
      if (!!this.isReady) {
        this.$emit("onSave", this.signal);
        this.dialog = false;
      }
    }
  }
};
</script>