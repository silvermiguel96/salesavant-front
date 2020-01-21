<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select :items="items" v-model="jobType" label="Job Type"></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="description" label="Description"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-file-input v-model="file" accept=".csv" label="Upload Input File"></v-file-input>
              </v-col>
              <v-col cols="12" sm="4" md="4" lg="3">
                <v-btn color="primary" class="text-capitalize" block @click.prevent="submitFiles">
                  <v-icon class="pr-1">backup</v-icon>Created
                </v-btn>
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
      items: [
        {
          value: "contact_finder",
          text: "Contact Finder"
        },
        {
          value: "linkedin_finder",
          text: "LinkedIn Finder"
        }
      ],
      jobType: "",
      description: "",
      file: null
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
        formData.append("file", this.file, this.file.name);
        formData.append("jobType", this.jobType);
        formData.append("description", this.description);
        fetch(this.salesavantAPI + "/launch-job?jwt=" + getAuthToken(), {
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