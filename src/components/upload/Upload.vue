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
                <v-file-input
                  v-model="file"
                  accept=".csv"
                  label="Document upload"
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-btn color="primary" class="text-capitalize" @click.prevent="submitFiles">Save</v-btn>
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
      items: ["ORB refresh", "Contacts", "Keywords"],
      file: null,
    };
  },
  props: {
    salesavantAPI: { type: String, default: process.env.VUE_APP_REST_API_URL }
  },
  components: {},
  methods: {
    submitFiles() {
      if (this.file) {
        let formData = new FormData();
        formData.append("files", this.file, this.file.name);
        fetch(this.salesavantAPI + "/files/upload", {
          method: "POST",
          body: formData
        })
          .then(response => {
            console.log(response.json());
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        console.log("there are no files.");
      }
    }
  }
};
</script>