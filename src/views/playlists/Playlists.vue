<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3" class="d-none d-md-block">
        <folder-list @updateSelectedFolder="updateSelectedFolder" />
      </v-col>
      <v-col cols="12" md="9">
        <v-card>
          <v-breadcrumbs
            :large="true"
            :items="[
                  {
                    text: selectedFolder? `${selectedFolder.name} / Playlists`:'Global / Playlists ',
                    disabled: true,
                    href: '/playlists'
                  }
              ]"
            divider=">"
            class="pl-3 pl-sm-6"
          ></v-breadcrumbs>
          <v-tabs grow background-color="grey lighten-5" color="primary">
            <!-- Tab Home -->
            <v-tab class="text-capitalize">Company Playlists</v-tab>
            <v-tab-item>
              <playlists-companies
                :folderId="selectedFolder? selectedFolder.id: undefined"
                :folderName="selectedFolder? selectedFolder.name: undefined"
              />
            </v-tab-item>
            <!-- tab comments -->
            <v-tab class="text-capitalize">Contacts Playlists</v-tab>
            <v-tab-item>
              <playlists-contacts />
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FolderList from "../../components/folders/FolderList.vue";
import PlaylistsCompanies from "../../components/playlists/playlists/PlaylistCompanies.vue";
import PlaylistsContacts from "../../components/playlists/playlists/PlaylistContacts.vue";

export default {
  data() {
    return {
      selectedFolder: undefined
    };
  },
  methods: {
    updateSelectedFolder(selectedFolder) {
      console.log("updateSelectedFolder", selectedFolder);
      this.selectedFolder = selectedFolder;
    }
  },
  components: {
    FolderList,
    PlaylistsCompanies,
    PlaylistsContacts
  }
};
</script>
