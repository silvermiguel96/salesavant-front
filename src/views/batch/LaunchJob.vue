<template>
  <v-container fluid>
    <v-card>
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
                  label="Upload Input File"
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
import { getAuthToken } from "../../util";
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
        formData.append("test1", "test1");
        formData.append("test2", "test2");
        fetch(this.salesavantAPI + "/files/upload?JWT="+getAuthToken(), {
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