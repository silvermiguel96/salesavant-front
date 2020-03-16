<template>
  <v-container fluid>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Delete signal</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <h1
              class="subtitle-1"
            >Confirm you want to eliminate the signal <span class="font-weight-bold">{{selectedItem.name}}</span>?</h1>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog = false">Close</v-btn>
          <v-btn color="red darken-1" class="text-capitalize" text @click="deleteSignal">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <long-paragraph class="wrapping-td" :text="item.name"></long-paragraph>
          </td>
          <td>
            <long-paragraph class="wrapping-td" :text="item.description"></long-paragraph>
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
          <td><format-date-time :time="item.creationTime" /></td>
          <td>
            <router-link v-if="item.id" :to="`/signals/${item.id}`">
              <v-icon size="20">edit</v-icon>
            </router-link>
          </td>
          <td>
            <div class="d-flex align-center justify-center">
            <v-icon
              @click="selectedSignal({
                item: item ,
                signalId: item.id})"
              color="red lighten-2"
              size="20"
            >delete</v-icon>
            </div>
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
import formatDateTime from "../../../components/common/FormatDateTime.vue";
import LongParagraph from "../../../components/common/LongParagraph";
export default {
  data() {
    return {
      dialog: false,
      options: {
        page: 1,
        itemsPerPage: 10
      },
      headers: [
        { text: "Name", value: "name", sortable: false, width: "15%" },
        {
          text: "Description",
          value: "description",
          align: "left",
          sortable: false,
          width: "20%"
        },
        { text: "Group", value: "group", align: "left", sortable: false, width: "15%"  },
        { text: "Category", value: "category", align: "left", sortable: false, width: "10%" },
        { text: "Default Score", value: "defaultScore", align: "left", sortable: false, width: "10%" },
        { text: "Creation Time", value: "creationTime", align: "left", sortable: false, width: "20%"   },
        { text: "Edit", value: "icon", align: "left", sortable: false, width: "5%"  },
        { text: "Delete", value: "icon", align: "center", sortable: false, width: "5%"  }
      ],
      signal: {},
      selectedSignalId: "",
      selectedItem: {}
    };
  },
  components: {
    LongParagraph,
    formatDateTime
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
    selectedSignal({ item, signalId }) {
      this.selectedItem = item;
      this.selectedSignalId = signalId;
      this.dialog = true;
    },
    deleteSignal() {
      console.log("this.selectedSignalId", this.selectedSignalId);
      this.$emit("deleteSignal", this.selectedSignalId);
      this.dialog = false;
    },
    async save() {
      if (!this.signal) {
        this.$eventBus.$emit("showSnack", "There's something wrong with the signal saving!", "error");
        return;
      }
      if (!this.signal.name) {
        this.$eventBus.$emit("showSnack", "Name can not be empty!", "error");
        return;
      }
      if (!this.signal.description) {
        this.$eventBus.$emit("showSnack", "Description can not be empty!", "error");
        return;
      }
      if (!this.signal.defaultScore) {
        this.$eventBus.$emit("showSnack", "Score can not be empty!", "error");
        return;
      }
      if (!this.signal.group) {
        this.$eventBus.$emit("showSnack", "Group can not be empty!", "error");
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
          this.$eventBus.$emit("showSnack", "it seems that we created/updated the signal but couldn't check it, please check manually", "error");
          return;
        }
        this.signal = signal;
        this.$eventBus.$emit("showSnack", "Signal successfully updated", "success");
      } catch (error) {
        this.$eventBus.$emit("showSnack", "oops we did something wrong!", "error");
        console.log("error saving signal", error);
      }
    },
    cancel() {
      this.signal = {};
      this.$eventBus.$emit("showSnack", "Canceled", "error");
    },
    open() {
      this.signal = {};
      this.$eventBus.$emit("showSnack", "You're editing a signal", "info");
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
