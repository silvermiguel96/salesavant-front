<template>
  <v-layout>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }" v-if="btnIcon">
        <v-icon color="primary" v-on="on">{{btnIcon}}</v-icon>
      </template>
      <template v-slot:activator="{ on }" v-else>
        <v-btn class="text-capitalize" block color="primary" v-on="on" min-width="150">
          <v-icon size="18" class="mr-2">add</v-icon>New User
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Add User</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="user.firstName" label="First Name" required></v-text-field>
                <v-text-field v-model="user.lastName" label="Last Name" required></v-text-field>
                <v-text-field v-model="user.email" type="email" label="Email" required></v-text-field>
                <v-select v-model="user.status" :items="items" label="Status"></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog = false">Close</v-btn>
          <v-btn
            color="green darken-1"
            class="text-capitalize"
            text
            @click="save"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    user: { 
      firstName: "",
      lastName: "",
      email: "",
      status: ""
    },
    items: ['Active', 'Inactive'],
  }),
  methods: {
    save() {
      if (!!this.description && !!this.item) {
        this.$emit("onSave", {
          description: this.description,
          item: this.item
        });
        this.description = "";
        this.dialog = false;
      } else if (!!this.description) {
        this.$emit("onSave", this.description);
        this.description = "";
        this.dialog = false;
      }
    }
  },
  props: {
    item: Object,
    btnIcon: String
  }
};
</script>