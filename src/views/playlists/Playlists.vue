<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="3" class="d-none d-md-block">
        <folder-list />
      </v-col>
      <v-col cols="12" md="9">
        <v-card>
          <v-breadcrumbs
            :large="true"
            :items="[
                  {
                    text: 'Playlists',
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
              <playlists-companies />
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
import FolderList from "./components/folder/FolderList.vue";
import PlaylistsCompanies from "./components/companies/PlaylistCompanies.vue";
import PlaylistsContacts from "./components/contacts/PlaylistContacts.vue";

export default {
  data() {
    return {
      selectedFolder: undefined
    };
  },
  components: {
    FolderList,
    PlaylistsCompanies,
    PlaylistsContacts
  }
};
</script>
