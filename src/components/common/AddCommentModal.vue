<template>
  <v-layout>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on: dialog }" v-if="btnIcon">
        <v-tooltip bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn icon v-bind="attrs" v-on="{ ...tooltip, ...dialog }">
              <v-icon color="primary">{{ btnIcon }}</v-icon>
            </v-btn>
          </template>
          <span>Add New Comment</span>
        </v-tooltip>
      </template>
      <template v-slot:activator="{ on: dialog }" v-else>
        <v-tooltip bottom>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              color="primary"
              v-bind="attrs"
              v-on="{ ...tooltip, ...dialog }"
              class="text-capitalize ma-2"
            >
              <v-icon size="18" class="mr-2">add</v-icon>Add comment
            </v-btn>
          </template>
        </v-tooltip>
      </template>
      <v-card>
        <v-card-title class="headline">Add comment</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="description"
                  label="description"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            class="text-capitalize"
            text
            @click="dialog = false"
            >Close</v-btn
          >
          <v-btn
            color="green darken-1"
            class="text-capitalize"
            :disabled="!description"
            text
            @click="save"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    description: "",
  }),
  methods: {
    save() {
      if (!!this.description && !!this.item) {
        this.$emit("onSave", {
          description: this.description,
          item: this.item,
        });
        this.description = "";
        this.dialog = false;
      } else if (!!this.description) {
        this.$emit("onSave", this.description);
        this.description = "";
        this.dialog = false;
      }
    },
  },
  props: {
    item: Object,
    btnIcon: String,
  },
};
</script>
