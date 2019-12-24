<template>
  <v-container fluid>
    <v-card>
      <v-breadcrumbs
        :large="true"
        :items="[
              {
                text: 'Upload',
                disabled: true,
                href: '/Upload'
              },
            ]"
      ></v-breadcrumbs>
      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select :items="items" label="Job Type"></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Description"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-file-input label="Document upload"></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-btn color="primary" class="text-capitalize" block>Save</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      items: ["ORB refresh", "Contacts", "Keywords"]
    };
  },
  components: {}
};
</script>