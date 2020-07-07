<template >
    <v-data-table
      :headers="folderId ? foldersHeaders : defaultHeaders"
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
            {{ item.modificationTime | moment("MMMM Do YYYY, H:mm")}}
          </td>
          <td>
            <div class="d-flex align-center justify-center" v-if="folderId || folderName ">
              <v-icon @click="removePlaylist(item)" color="red lighten-2" size="20" small>delete</v-icon>
            </div>
            <div class="d-flex align-center justify-center" v-else>
              <v-icon @click="deletePlaylist(item)" color="red lighten-2" size="20" small>delete</v-icon>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
</template>

<script>
const defaultHeaders = [
  { text: "Name", value: "name", width: "40%", sortable: false },
  { text: "Size", value: "totalCompanies", width: "20%", sortable: true },
  {
    text: "Modification Time",
    value: "modificationTime",
    width: "30%",
    sortable: true
  },
  { text: "Delete", width: "10%", sortable: false, align: "center" }
];
export default {
  data() {
    return {
      defaultHeaders: defaultHeaders,
      foldersHeaders: defaultHeaders.map(item => {
        if(item.text == "Delete") {
          return  { text: "Remove", width: "10%", sortable: false, align: "center" };
        }
        return item;
      }),
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
    async removePlaylist(item) {
      const res = await this.$confirm(
        ` <h1 class="subtitle-1">Confirm you want to remove playlist <span class="font-weight-bold">${item.name}</span> the folder <span class="font-weight-bold">${this.folderName}</span>  ?</h1>`,
        {
          buttonTrueText: "delete",
          buttonFalseText: "close",
          buttonTrueColor: "red lighten-2",
          color: "primary",
          icon: "delete",
          title: "Remove Playlist",
          width: 600
        }
      );
      if (res) {
        console.log("the playlist", item);
        this.$emit("removePlaylist", {
          item,
          folderId: this.folderId
        });
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
    totalResults: Number,
    folderId: String,
    folderName: String
  }
};
</script>
