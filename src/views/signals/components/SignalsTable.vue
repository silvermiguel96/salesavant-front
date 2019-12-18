<template>
  <v-container fluid>
    <v-snackbar top v-model="snack" :timeout="10000" :color="snackColor">
      {{ snackText }}
      <v-btn text @click="snack = false">Close</v-btn>
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :items="items"
      :server-items-length="totalResults"
      :items-per-page="options.itemsPerPage"
      :footer-props="{
        'items-per-page-options': [10, 20, 50]
      }"
      :options.sync="options"
      class="mx-2"
      @update:options="updateOptions"
    >
      <v-progress-linear
        v-slot:progress
        color="blue"
        indeterminate
      ></v-progress-linear>
      <template v-slot:item="{ item, headers }">
        <tr>
          <td>{{ item.id || "" }}</td>
          <td>
            <long-paragraph
              class="wrapping-td"
              :text="item.name"
            ></long-paragraph>
          </td>
          <td>
            <long-paragraph
              class="wrapping-td"
              :text="item.description"
            ></long-paragraph>
          </td>
          <td>
            <v-edit-dialog
              :return-value.sync="item.group"
              large
              lazy
              persistent
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              <div>{{ item.group || "--" }}</div>
              <template v-slot:input>
                <div class="mt-3 title">Update group</div>
              </template>
              <template v-slot:input>
                <v-text-field
                  v-model="item.group"
                  label="Edit group"
                  single-line
                  counter
                  autofocus
                  @input="changeData({ ...item })"
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </td>
          <td>{{ item.category || "" }}</td>
          <td>
            <v-edit-dialog
              :return-value.sync="item.defaultScore"
              large
              lazy
              persistent
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              <div>{{ item.defaultScore || "--" }}</div>
              <template v-slot:input>
                <div class="mt-3 title">Update Score</div>
              </template>
              <template v-slot:input>
                <v-text-field
                  v-model="item.defaultScore"
                  label="Edit score"
                  single-line
                  counter
                  autofocus
                  @input="changeData({ ...item })"
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </td>
          <td>{{ changeTimeHuman(item.creationTime) || "" }}</td>
          <td>{{ changeTimeHuman(item.modificationTime) || "" }}</td>
          <td>
            <router-link v-if="item.id" :to="`/signals/${item.id}`">
              <v-icon size="20">edit</v-icon>
            </router-link>
          </td>
          <td>
            <v-icon
              @click="deleteSignal(item.id)"
              color="red lighten-2"
              size="20"
              >delete</v-icon
            >
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
import gql from "graphql-tag";
import _get from "lodash.get";
import LongParagraph from "../../../components/common/LongParagraph";
export default {
  data() {
    return {
      options: {
        page: 1,
        itemsPerPage: 10
      },
      headers: [
        {
          text: "ID",
          align: "left",
          sortable: true,
          value: "id"
        },
        { text: "Name", value: "name", sortable: false },
        {
          text: "Description",
          value: "description",
          align: "left",
          sortable: false 
        },
        { text: "Group", value: "group", align: "left", sortable: false  },
        { text: "Category", value: "category", align: "left", sortable: false  },
        { text: "Default Score", value: "defaultScore", align: "left", sortable: false  },
        { text: "Creation Time", value: "creationTime", align: "left", sortable: false  },
        { text: "Modification Time", value: "modificationTime", align: "left", sortable: false  },
        { text: "Edit", value: "icon", align: "left", sortable: false },
        { text: "Delete", value: "icon", align: "left", sortable: false }
      ],
      snack: false,
      snackColor: "",
      snackText: "",
      signal: {}
    };
  },
  components: {
    LongParagraph
  },
  methods: {
    updateOptions(dataFromEvent = {}) {
      this.$emit("updateOptions", { dataFromEvent });
    },
    _get: _get,
    trimText(text = "") {
      if (!!text) {
        return `${text.substring(0, 100)}${text.length > 100 ? "..." : ""}`;
      }
    },
    deleteSignal(signalId) {
      this.$emit("deleteSignal", signalId);
    },
    changeTimeHuman(time) {
      let HumanDate = time.split(".", 1).toString();
      let HumanTime = HumanDate.split("T", 2).join(" ");
      return HumanTime;
    },
    async save() {
      if (!this.signal) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "There's something wrong with the signal saving!";
        return;
      }
      if (!this.signal.name) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Name can not be empty!";
        return;
      }
      if (!this.signal.description) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Description can not be empty!";
        return;
      }
      if (!this.signal.defaultScore) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Score can not be empty!";
        return;
      }
      if (!this.signal.group) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "Group can not be empty!";
        return;
      }
      try {
        console.log("here");
        const result = await this.$apollo.mutate({
          //////////////////
          mutation: gql`
            mutation(
              $signalId: Int!
              $name: String
              $description: String
              $group: String
              $category: String
              $score: Float
            ) {
              updateSignal(
                signalData: {
                  name: $name
                  description: $description
                  group: $group
                  category: $category
                  defaultScore: $score
                }
                signalId: $signalId
              ) {
                signal {
                  id
                  name
                  group
                  userId
                  category
                  accountId
                  description
                  creationTime
                  defaultScore
                  modificationTime
                }
              }
            }
          `,
          // Parameters
          variables: {
            signalId: this.signal.id,
            name: this.signal.name,
            description: this.signal.description,
            group: this.signal.group,
            category: this.signal.category,
            score: this.signal.defaultScore
          }
        });
        const signal = _get(result, "data.updateSignal.signal", null);
        if (!signal) {
          this.snack = true;
          this.snackColor = "error";
          this.snackText =
            "it seems that we created/updated the signal but couldn't check it, please check manually";
          return;
        }
        this.signal = signal;
        this.snack = true;
        this.snackColor = "success";
        this.snackText = "Signal successfully updated";
      } catch (error) {
        this.snack = true;
        this.snackColor = "error";
        this.snackText = "oops we did something wrong!";
        console.log("error saving signal", error);
      }
    },
    cancel() {
      this.signal = {};
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Canceled";
    },
    open() {
      this.signal = {};
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "You're editing a signal";
    },
    close(closeInput) {
      console.log({ closeInput });
    },
    changeData(signal = {}) {
      this.signal = signal;
    }
  },
  props: {
    items: Array,
    totalResults: Number
  }
};
</script>
<style scoped>
.wrapping-td {
  white-space: normal;
}
a {
  text-decoration: none;
}
</style>
