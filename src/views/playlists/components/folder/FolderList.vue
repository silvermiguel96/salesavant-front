<template>
  <v-card>
    <v-row no-gutters class="ml-2">
      <v-col cols="12">
        <v-list shaped>
          <v-subheader class="pl-0 pl-sm-2 body-1">Folders</v-subheader>
          <v-list-item-group
            v-model="selected"
            color="primary"
            style="max-height:60vh; overflow-y:scroll;"
          >
            <v-list-item
              v-for="(folder, i) in processedFolders"
              :key="folder.id"
              class="pl-3 pr-2"
              @click.prevent
              v-on:dragover.prevent
              v-on:drop="drop(folder, $event)"
            >
              <v-list-item-icon class="mr-1">
                <v-icon small v-if="folder.name=='All'">grade</v-icon>
                <v-icon small v-else-if="folder.name=='Favorites'">grade</v-icon>
                <v-icon small v-else>{{i==selected?"folder_open":"folder"}}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="folder.name" class="body-2"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action class="my-0">
                <v-btn icon>
                  <v-icon
                    v-if="folder.name!='All' && folder.name!='Favorites'"
                    v-on:click="deleteFolder(folder, i)"
                    small
                  >delete</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-chip
                v-if="folder.name!='All'"
                color="light-blue darken-2"
                text-color="white"
                small
              >{{folder.playlists.length}}</v-chip>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
    <v-row no-gutters class="mx-4">
      <v-col cols="12">
        <v-text-field
          v-model="folderInput"
          v-on:keydown="folderInputKeydown"
          label="Add a Folder"
          append-icon="keyboard_return"
          dense
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
export default {
  data: () => ({
    selected: null,
    folderInput: ""
  }),
  methods: {
    clickFolder(folder, event) {
      event.preventDefault();
      console.log("Folder click", folder);
    },
    folderInputKeydown(event) {
      switch (event.key) {
        case "Enter":
          this.folders.foldersList.push({
            name: this.folderInput,
            playlists: [],
            contacts: []
          });
          this.folderInput = "";
          break;
        case "Escape":
          this.folderInput = "";
          break;
      }
    },
    deleteFolder(folder, i) {
      console.log(folder);
      this.folders.splice(i, 1);
    },
    drop(folder, event) {
      console.log("drop", event);
      const eventString = event.dataTransfer.getData("text");
      const [eventType, playlistUid, playlistName] = eventString.split(">>>");
      console.log("playlistUid", playlistUid);
      if (eventType && playlistUid) {
        this.addPlaylsitToFolder(
          folder.id,
          eventType,
          playlistUid,
          playlistName
        );
      }
    },
    addPlaylsitToFolder(folderId, eventType, playlistUid, playlistName) {
      const folder = this.folders.foldersList.find(
        folder => folder.id === folderId
      );
      if (folder) {
        folder.playlists.push(playlistUid);
        this.$eventBus.$emit(
          "showSnack",
          `Playlist "${playlistName}" added successfully`,
          "success"
        );
      } else {
        console.log("Folder not found", folderId);
      }
    }
  },
  computed: {
    processedFolders() {
      const allFolders = [{ id: undefined, name: "All" }];
      if (this.folders) {
        const mappedFolders = this.folders.foldersList.map(folder => {
          folder.playlists = folder.playlists.map(playlist => playlist.uid);
          folder.playlists = folder.contacts.map(contact => contact.uid);
          return folder;
        });
        Array.prototype.push.apply(allFolders, mappedFolders);
      }
      return allFolders;
    }
  },
  watch: {
    selected: function() {
      if (this.folders && this.folders.foldersList) {
        const selectedFolder = this.folders.foldersList[this.selected];
        this.$emit("updateSelectedFolder", selectedFolder);
      }
    }
  },
  apollo: {
    folders: {
      query: gql`
        query folders {
          folders {
            foldersList {
              id
              name
              playlists {
                uid
              }
              contacts {
                uid
              }
            }
          }
        }
      `,
      fetchPolicy: "cache-and-network"
    }
  }
};
</script>