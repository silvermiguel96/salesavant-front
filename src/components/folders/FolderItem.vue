<template>
  <v-row
    no-gutters
    class="align-center"
    v-bind:style="dashedBorder"
    v-on:dragover.prevent
    v-on:dragenter="dragenter($event)"
    v-on:dragleave="dragleave($event)"
    v-on:drop="drop($event)"
  >
    <v-col cols="1">
      <v-icon small v-if="folder.name == 'Favorites'">grade</v-icon>
      <v-icon small v-else>folder</v-icon>
    </v-col>

    <v-col cols="8" class="align-center">
      <v-text-field
        v-show="!edit"
        v-text="folder.name + ' (' + folderNumItems + ')'"
        class="body-2 pt-0 mt-0"
      />
      <input
        type="text"
        v-model="folder.name"
        v-show="edit"
        v-on:keydown="saveEditEnter($event)"
        style="max-width: 85%;"
      />
    </v-col>

    <v-col cols="2">
      <div class="d-flex flex-row justify-space-around align-center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon v-show="!edit" v-on:click="toggleEdit($event)" small
                >edit</v-icon
              >
            </v-btn>
          </template>
          <span>Edit Folder</span>
        </v-tooltip>
        <v-tooltip  bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon
                color="red lighten-2"
                v-on:click="deleteFolder($event)"
                small
                >delete</v-icon
              >
            </v-btn>
          </template>
          <span>Delete Folder</span>
        </v-tooltip>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      edit: false,
      hightlight: false,
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
        if (!this.folder.name || this.folder.name.length < 5) {
          this.$eventBus.$emit("showSnack", "Name must be at least 5", "error");
          return;
        }
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
              newName: this.folder.name,
            },
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
      // console.log("dragenter");
      this.hightlight = true;
    },
    dragleave(event) {
      // console.log("dragleave");
      setTimeout(() => (this.hightlight = false), 500);
    },
    drop(event) {
      // console.log("drop", event);
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
          playlistName,
        });
      }
    },
  },
  computed: {
    folderNumItems() {
      return (
        this.folder.companyPlaylists.length +
        this.folder.contactPlaylists.length
      );
    },
    dashedBorder() {
      if (this.hightlight) {
        return {
          border: "1px dashed #1976D6",
          "border-radius": "5px",
        };
      }
      return {};
    },
  },
  props: {
    index: Number,
    folder: Object,
  },
};
</script>

<style></style>
