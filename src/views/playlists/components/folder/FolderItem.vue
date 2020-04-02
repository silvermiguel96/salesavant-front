<template>
  <v-row
    no-gutters
    class="align-center"
    v-on:dragover.prevent
    v-on:dragenter="dragenter($event)"
    v-on:dragleave="dragleave($event)"
    v-on:drop="drop($event)"
  >
    <v-col cols="1">
      <v-icon small v-if="folder.name=='Favorites'">grade</v-icon>
      <v-icon small v-else>folder</v-icon>
    </v-col>

    <v-col cols="7" class="align-center">
      <v-text-field v-show="!edit" v-text="folder.name" class="body-2 pt-0 mt-0"></v-text-field>
      <input
        type="text"
        v-model="folder.name"
        v-show="edit"
        v-on:keydown="saveEditEnter($event)"
        style="max-width: 140px;"
      />
    </v-col>

    <v-col cols="1">
      <v-btn icon>
        <v-icon v-show="!edit" v-on:click="toggleEdit($event)" small>edit</v-icon>
      </v-btn>
    </v-col>

    <v-col cols="1">
      <v-btn icon>
        <v-icon v-on:click="deleteFolder($event)" small>delete</v-icon>
      </v-btn>
    </v-col>

    <v-col cols="2">
      <v-chip color="light-blue darken-2" text-color="white" small>{{folderNumItems}}</v-chip>
    </v-col>
  </v-row>
</template>

<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      edit: false
    };
  },
  methods: {
    toggleEdit(event) {
      event.stopPropagation();
      this.edit = !this.edit;
      if (this.edit) {
        this.$nextTick(function() {
          this.$el.getElementsByTagName("input")[0].focus();
        });
      }
    },
    async saveEditEnter(event) {
      console.log("saveEditEnter");
      if (event.key == "Enter") {
        try {
          let result = null;
          result = await this.$apollo.mutate({
            mutation: gql`
              mutation($folderId: Int!, $newName: String!) {
                updateFolderName(folderId: $folderId, newName: $newName) {
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
              folderId: parseInt(this.folder.id),
              newName: this.folder.name
            }
          });
          this.$eventBus.$emit(
            "showSnack",
            `Folder name updated to "${this.folder.name}"`,
            "success"
          );
          this.toggleEdit(event);
        } catch (error) {
          this.$eventBus.$emit(
            "showSnack",
            "Oops! something went wrong when updating the folder name, please try again.",
            "error"
          );
          console.log("error delete playlist", error);
        }
      }
    },
    deleteFolder(event) {
      event.stopPropagation();
      this.$emit("deleteFolder");
    },
    dragenter(event) {
      console.log("dragenter");
    },
    dragleave(event) {
      console.log("dragleave");
    },
    drop(event) {
      console.log("drop", event);
      const eventString = event.dataTransfer.getData("text");
      const [playlistType, playlistUid, playlistName] = eventString.split(
        ">>>"
      );
      if (playlistType && playlistUid) {
        const folderId = this.folder.id;
        this.$emit("addPlaylistToFolder", {
          folderId,
          playlistType,
          playlistUid,
          playlistName
        });
      }
    }
  },
  computed: {
    folderNumItems() {
      return (
        this.folder.companyPlaylists.length +
        this.folder.contactPlaylists.length
      );
    }
  },
  props: {
    index: Number,
    folder: Object
  }
};
</script>

<style>
</style>