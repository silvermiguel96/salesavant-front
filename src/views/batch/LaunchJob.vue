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
              <template v-if="jobType=='playlist_from_file'">
                <v-col cols="12">
                  <v-text-field
                    v-model="playlistName"
                    label="Playlist Name"
                    :error="playlistError"
                    :error-messages="playlistMessages"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="playlistDescription" label="Playlist Description"></v-text-field>
                </v-col>
                <v-col>
                  <h2 class="title">Upload a CSV file</h2>
                  <h3 class="body-2">Your CVS file must use commas as delimiters and must include the following columns:</h3>
                  <ul>
                    <li>Website</li>
                    <li>Scale Score</li>
                    <li>Capital Efficiency Score</li>
                    <li>Capital Efficiency Estimate</li>
                  </ul>
                </v-col>
              </template>
              <template v-if="jobType=='contacts_from_file'">
                <v-col cols="12">
                  <v-text-field v-model="description" label="Description"></v-text-field>
                </v-col>
                <v-col>
                  <h2 class="title">Upload a CSV file</h2>
                  <h3 class="body-2">Your CVS file must use commas as delimiters and must include the following columns:</h3>
                  <ul>
                    <li>Full name</li>
                    <li>LinkedIn</li>
                    <li>Website</li>
                    <li>Scale Score Average</li>
                    <li>Capital Efficiency Score Average</li>
                    <li>Capital Efficiency Estimate Average</li>
                    <li>Numbers of Exits</li>
                    <li>Title</li>
                    <li>Rank</li>
                    <li>Deparment</li>
                    <li>Current Job</li>
                  </ul>
                </v-col>
              </template>
              <template v-else-if="jobType=='linkedin_finder' || jobType=='contact_finder' ">
                <v-col cols="12">
                  <v-text-field v-model="description" label="Description"></v-text-field>
                </v-col>
              </template>
              <v-col cols="12">
                <v-file-input
                  v-model="file"
                  accept=".csv"
                  label="Upload Input File"
                  :error="fileError"
                  :error-messages="fileMessages"
                ></v-file-input>
              </v-col>
              <v-col cols="12" sm="4" md="4" lg="3">
                <v-btn color="primary" class="text-capitalize" block @click.prevent="submitFiles">
                  <v-icon class="pr-1">backup</v-icon>Create
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
        },
        {
          value: "playlist_from_file",
          text: "Playlist From File"
        },
        {
          value: "contacts_from_file",
          text: "Contacts From File"
        }
      ],
      jobType: "",
      description: "",
      playlistName: null,
      playlistError: false,
      playlistMessages: undefined,
      playlistDescription: "",
      file: null,
      fileError: false,
      fileMessages: undefined
    };
  },
  props: {
    salesavantAPI: { type: String, default: process.env.VUE_APP_REST_API_URL }
  },
  components: {},
  methods: {
    submitFiles() {
      if (this.file) {
        this.fileError = false;
        this.fileMessages = null;
        let formData = new FormData();
        formData.append("file", this.file, this.file.name);
        formData.append("jobType", this.jobType);
        if (this.jobType == "playlist_from_file") {
          if (this.playlistName) {
            formData.append("playlistName", this.playlistName);
            formData.append("playlistDescription", this.playlistDescription);
          } else {
            this.playlistError = true;
            this.playlistMessages = ["The Name is required!"];
            return;
          }
        } else {
          formData.append("description", this.description);
        }
        fetch(this.salesavantAPI + "/launch-file-job?jwt=" + this.getUserToken, {
          method: "POST",
          body: formData
        })
          .then(response => {
            console.log(response.json());
            this.$eventBus.$emit(
              "showSnack",
              `Job ${this.jobType} enqueed successfully`,
              "success"
            );
            this.$router.push({
              path: `/batch`
            });
          })
          .catch(error => {
            console.error(error);
          });
      } else if (this.jobType == "playlist_from_file") {
        if (!this.playlistName) {
          this.playlistError = true;
          this.playlistMessages = ["The Name is required!"];
        } else {
          this.playlistError = false;
          this.playlistMessages = null;
        }
        this.fileError = true;
        this.fileMessages = ["The file is required!"];
        return;
      } else {
        this.fileError = true;
        this.fileMessages = ["The file is required!"];
        return;
      }
    }
  },
  computed:{
    getUserToken(){
      return this.$store.state.userToken;
    }
  }
};
</script>