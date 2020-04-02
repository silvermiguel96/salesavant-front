<template>
  <v-card>
    <v-row no-gutters class="ml-3">
      <v-col cols="12">
        <v-list shaped class="pr-1">
          <v-subheader class="pl-0 pl-sm-2 body-1">Folders</v-subheader>
          <v-list-item-group
            v-model="selected"
            color="primary"
            style="max-height:60vh; overflow-y:scroll;"
          >
            <v-list-item
              v-for="(folder, i) in processedFolders"
              :key="folder.id"
              class="pl-1 pr-0"
              @click.prevent
            >
              <folder-item
                :folder="folder"
                :index="i"
                @deleteFolder="deleteFolder(folder, i)"
                @addPlaylistToFolder="addPlaylistToFolder"
              />
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
import FolderItem from "./FolderItem.vue";
export default {
  data: () => ({
    selected: null,
    folders: [],
    folderInput: ""
  }),
  methods: {
    async folderInputKeydown(event) {
      switch (event.key) {
        case "Enter":
          try {
            let result = null;
            result = await this.$apollo.mutate({
              mutation: gql`
                mutation($name: String!) {
                  createFolder(name: $name) {
                    folder {
                      id
                      name
                      companyPlaylists {
                        uid
                      }
                      contactPlaylists {
                        uid
                      }
                    }
                  }
                }
              `,
              variables: {
                name: this.folderInput
              }
            });
            console.log("Result", result.data.createFolder.folder);
            this.folders.foldersList.push(result.data.createFolder.folder);
          } catch (error) {
            this.$eventBus.$emit(
              "showSnack",
              "Oops! something went wrong when removing the playlist, please try again.",
              "error"
            );
            console.log("error delete playlist", error);
          }
          this.folderInput = "";
          break;
        case "Escape":
          this.folderInput = "";
          break;
      }
    },
    async deleteFolder(folder, index) {
      console.log("deleteFolder", folder);
      try {
        let result = null;
        result = await this.$apollo.mutate({
          mutation: gql`
            mutation($folderId: Int!) {
              deleteFolder(folderId: $folderId) {
                folder {
                  id
                  name
                }
              }
            }
          `,
          variables: {
            folderId: parseInt(folder.id)
          }
        });
        console.log("Result", result);
        this.folders.foldersList.splice(index, 1);
      } catch (error) {
        this.$eventBus.$emit(
          "showSnack",
          "Oops! something went wrong when removing the playlist, please try again.",
          "error"
        );
        console.log("error delete playlist", error);
      }
    },
    async addPlaylistToFolder({
      folderId,
      playlistType,
      playlistUid,
      playlistName
    }) {
      console.log("addPlaylistToFolder", folderId);
      const folder = this.folders.foldersList.find(
        folder => folder.id === folderId
      );

      const processedFolder = this.processedFolders.find(
        folder => folder.id === folderId
      );
      console.log("folder", folder);
      if (playlistType == "playlistCompanies") {
        if (processedFolder.companyPlaylistsSet.has(playlistUid)) {
          this.$eventBus.$emit(
            "showSnack",
            "Playlist is alaready on that folder",
            "error"
          );
          return;
        }
        try {
          let result = null;
          result = await this.$apollo.mutate({
            mutation: gql`
            mutation(
              $folderId: Int!
              $playlistUid: String!
            ) {
              addCompanyPlaylistToFolder(
                  folderId: $folderId
                  playlistUid: $playlistUid
              ) {
                folder {
                  id
                  name
                  companyPlaylists {
                    uid
                  }
                  contactPlaylists {
                    uid
                  }
                }
              }
            }
          `,
            variables: {
              folderId: parseInt(folder.id),
              playlistUid: playlistUid
            }
          });
          console.log("Result", result);
        } catch (error) {
          this.$eventBus.$emit(
            "showSnack",
            "Oops! something went wrong when removing the playlist, please try again.",
            "error"
          );
          console.log("error delete playlist", error);
        }
        folder.companyPlaylists.push(playlistUid);
      }
      if (playlistType == "playlistContacts") {
        if (processedFolder.contactPlaylistsSet.has(playlistUid)) {
          this.$eventBus.$emit(
            "showSnack",
            "Playlist is alaready on that folder",
            "error"
          );
          return;
        }
        folder.contactPlaylists.push(playlistUid);
      }
      this.$eventBus.$emit(
        "showSnack",
        `Playlist "${playlistName}" added successfully to "${folder.name}"`,
        "success"
      );
    }
  },
  computed: {
    processedFolders() {
      if (this.folders && this.folders.foldersList) {
        return this.folders.foldersList.map(folder => {
          folder.companyPlaylists = folder.companyPlaylists.map(playlist =>
            playlist ? playlist.uid : undefined
          );
          folder.companyPlaylistsSet = new Set(folder.companyPlaylists);

          folder.contactPlaylists = folder.contactPlaylists.map(playlist =>
            playlist ? playlist.uid : undefined
          );
          folder.contactPlaylistsSet = new Set(folder.contactPlaylists);
          return folder;
        });
      }
      return [];
    }
  },
  watch: {
    selected: function() {
      if (this.processedFolders) {
        const selectedFolder = this.processedFolders[this.selected];
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
              companyPlaylists {
                uid
              }
              contactPlaylists {
                uid
              }
            }
          }
        }
      `,
      fetchPolicy: "cache-and-network"
    }
  },
  components: {
    FolderItem
  }
};
</script>