<template>
  <div>
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
      <v-progress-linear color="blue" indeterminate></v-progress-linear>
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <router-link :to="`/signals/${item.id}`">
              <long-paragraph :text="item.name" :maxLength="35"></long-paragraph>
            </router-link>
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
          <td>
            <v-edit-dialog
              :return-value.sync="item.score"
              large
              lazy
              persistent
              @save="save"
              @cancel="cancel"
              @open="open"
              @close="close"
            >
              <div>{{ item.score || "--" }}</div>
              <template v-slot:input>
                <div class="mt-3 title">Update Score</div>
              </template>
              <template v-slot:input>
                <v-text-field
                  v-model="item.score"
                  label="Edit score"
                  single-line
                  counter
                  autofocus
                  @input="changeData({ ...item })"
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </td>
          <td>{{ item.modificationTime | moment("MMMM Do YYYY, H:mm")}}</td>
          <td>
            <div class="d-flex align-center justify-center">
              <v-icon @click="deleteSignal(item)" color="red lighten-2" size="20" small>delete</v-icon>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
/* import PLAYLISTS from "./Playlists.gql"; */
import gql from "graphql-tag";
import _get from "lodash.get";
import LongParagraph from "../common/LongParagraph.vue";

export default {
  data() {
    return {
      dialog: false,
      options: {
        page: 1,
        itemsPerPage: 10,
      },
      headers: [
        { text: "Name", value: "name", sortable: false, width: "15%" },
        {
          text: "Description",
          value: "description",
          align: "left",
          sortable: false,
          width: "15%",
        },
        {
          text: "Group",
          value: "group",
          align: "left",
          sortable: false,
          width: "15%",
        },
        {
          text: "Score",
          value: "score",
          align: "left",
          sortable: true,
          width: "15%",
        },
        {
          text: "Modification Time",
          value: "modificationTime",
          align: "left",
          sortable: true,
          width: "15%",
        },
        {
          text: "Remove",
          value: "icon",
          align: "center",
          sortable: false,
          width: "10%",
        },
      ],
      signal: {},
      selectedSignalId: "",
      selectedItem: {},
    };
  },
  components: {
    LongParagraph,
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
    async deleteSignal(item) {
      const res = await this.$confirm(
        ` <h1 class="subtitle-1"
            >Confirm you want to eliminate the signal <span class="font-weight-bold">${item.name}</span>?</h1>`,
        {
          buttonTrueText: "delete",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "primary",
          icon: "delete",
          title: "Delete Signal",
          width: 600,
        }
      );
      if (res) {
        console.log("the signal", item);
        this.$emit("deleteSignal", item);
      }
    },
    async save() {
      if (!this.signal) {
        this.$eventBus.$emit(
          "showSnack",
          "There's something wrong with the signal saving!",
          "error"
        );
        return;
      }
      if (!this.signal.name) {
        this.$eventBus.$emit("showSnack", "Name can not be empty!", "error");
        return;
      }
      if (!this.signal.description) {
        this.$eventBus.$emit(
          "showSnack",
          "Description can not be empty!",
          "error"
        );
        return;
      }
      if (!this.signal.score) {
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
                  score: $score
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
                  score
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
            score: this.signal.score,
          },
        });
        const signal = _get(result, "data.updateSignal.signal", null);
        if (!signal) {
          this.$eventBus.$emit(
            "showSnack",
            "it seems that we created/updated the signal but couldn't check it, please check manually",
            "error"
          );
          return;
        }
        this.signal = signal;
        this.$eventBus.$emit(
          "showSnack",
          "Signal successfully updated",
          "success"
        );
      } catch (error) {
        this.$eventBus.$emit(
          "showSnack",
          "oops we did something wrong!",
          "error"
        );
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
    },
  },
  props: {
    items: Array,
    totalResults: Number,
  },
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
