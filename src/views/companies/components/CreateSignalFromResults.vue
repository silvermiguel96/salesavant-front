<template>
  <v-layout>
    <v-dialog v-model="dialog" persistent max-width="600px" lazy>
      <template v-slot:activator="{ on }">
        <v-btn color="blue" small class="text-capitalize ma-2" dark v-on="on"><v-icon small>add</v-icon>Create signal from search results</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Just a few steps more and your signal will be ready</span>
        </v-card-title>
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
                    v-model="signal.defaultScore"
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
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" :disabled="!isReady" text @click="save">Save</v-btn>
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
      defaultScore: "",
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