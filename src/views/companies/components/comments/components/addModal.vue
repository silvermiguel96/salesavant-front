<template>
  <v-layout>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" class="text-capitalize ma-2" v-on="on">
          <v-icon size="18" class="mr-2">add</v-icon>new commets
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Comments</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="commetsName" label="Name" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog = false">Close</v-btn>
          <v-btn color="green darken-1" class="text-capitalize" :disabled="!commetsName" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    commetsName: ""
  }),
  methods: {
    save() {
      if (!!this.commetsName) {
        this.$emit("onSave", this.commetsName);
        this.dialog = false;
      }
    }
  }
};
</script>