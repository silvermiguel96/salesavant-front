<template >
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Delete playlist</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <h1 class="subtitle-1">
              Confirm you want to eliminate the playlist
              <span class="font-weight-bold">{{selectedItem.name}}</span>?
            </h1>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class="text-capitalize" text @click="dialog = false">Close</v-btn>
          <v-btn color="red darken-1" class="text-capitalize" text @click="deletePlaylist">Delete</v-btn>
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
      <template v-slot:item="{ item, headers }">
        <tr>
          <td>
            <router-link :to="`playlists/${item.uid}`">{{item.name}}</router-link>
          </td>
          <td>{{ item.totalCompanies ? item.totalCompanies.toLocaleString() : "0"}}</td>
          <td>{{ changeTimeHuman(item.creationTime) }}</td>
          <td>
            <div class="d-flex align-center justify-center">
            <v-icon
              @click="selectedPlaylist({
                item: item,
                playlistId: item.uid})"
              color="red lighten-2"
              size="20"
            >delete</v-icon>
          </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
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
          sortable: false
        },
        { text: "Remove", width: "10%", sortable: false,  align: "center" }
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
  methods: {
    updateOptions(dataFromEvent = {}) {
      this.$emit("updateOptions", { dataFromEvent });
    },
    changeTimeHuman(time) {
      let HumanDate = time.split(".", 1).toString();
      let HumanTime = HumanDate.split("T", 2).join(" ");
      return HumanTime;
    },
    selectedPlaylist({ item, playlistId }) {
      this.selectedItem = item;
      this.selectedPlaylistId = playlistId;
      this.dialog = true;
    },
    deletePlaylist() {
      console.log("this.selectedPlaylistId", this.selectedPlaylistId);
      this.$emit("deletePlaylist", this.selectedPlaylistId);
      this.dialog = false;
    },
  },
  props: {
    items: Array,
    totalResults: Number
  }
};
</script>
