<template >
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Delete playlist</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <h1 class="subtitle-1">
              Confirm you want to eliminate the playlist
              <span
                class="font-weight-bold"
              >{{selectedItem.name}}</span>?
            </h1>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog = false">Close</v-btn>
          <v-btn color="red darken-1" class="text-capitalize" text @click="deletePlaylist">delete</v-btn>
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
      <template v-slot:item="{ item }">
        <tr>
          <td draggable="true" v-on:dragstart="dragstart(item, $event)">
            <router-link :to="`playlists/${item.uid}`">{{item.name}}</router-link>
          </td>
          <td>{{ item.totalCompanies ? item.totalCompanies.toLocaleString() : "0"}}</td>
          <td>
            <format-date-time :time="item.creationTime" />
          </td>
          <td>
            <div class="d-flex align-center justify-center">
              <v-icon @click="deletePlaylist(item)" color="red lighten-2" size="20" small>delete</v-icon>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import formatDateTime from "../common/FormatDateTime.vue";
export default {
  data() {
    return {
      headers: [
        { text: "Name", value: "name", width: "40%", sortable: false },
        { text: "Size", value: "totalCompanies", width: "20%", sortable: true },
        {
          text: "Creation Time",
          value: "creationTime",
          width: "30%",
          sortable: true
        },
        { text: "Remove", width: "10%", sortable: false, align: "center" }
      ],
      options: {
        page: 1,
        itemsPerPage: 10
      },
      dialog: false,
      selectedItem: "",
      selectedPlaylistId: {}
    };
  },
  components: {
    formatDateTime
  },
  methods: {
    updateOptions(dataFromEvent = {}) {
      this.$emit("updateOptions", { dataFromEvent });
    },
    async deletePlaylist(item) {
      const res = await this.$confirm(
        ` <h1 class="subtitle-1">Confirm you want to eliminate the playlist <span class="font-weight-bold">${item.name}</span>?</h1>`,
        {
          buttonTrueText: "delete",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "primary",
          icon: "delete",
          title: "Delete Playlist",
          width: 600
        }
      );
      if (res) {
        console.log("the playlist", item);
        this.$emit("deletePlaylist", item);
      }
    },
    dragstart(item, event) {
      console.log("dragstart", item);
      event.dataTransfer.setData(
        "text/plain",
        `playlistCompanies>>>${item.uid}>>>${item.name}`
      );
    }
  },
  props: {
    items: Array,
    totalResults: Number
  }
};
</script>
