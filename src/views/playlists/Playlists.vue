<template>
  <v-container fluid>
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
        <v-tab class="text-capitalize">Company</v-tab>
        <v-tab-item>
          <playlists-companies />
        </v-tab-item>
        <!-- tab comments -->
        <v-tab class="text-capitalize">Contacts</v-tab>
        <v-tab-item>
          <playlists-contacts />
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
import PlaylistsCompanies from "./components/companies/PlaylistCompanies.vue";
import PlaylistsContacts from "./components/contacts/PlaylistContacts.vue";

export default {
  data() {
    return {};
  },
  components: {
    PlaylistsCompanies,
    PlaylistsContacts
  }
};
</script>
