<template>
  <v-layout align-start justify-center column>
    <v-breadcrumbs
      :items="[
            {
              text: 'Playlists',
              disabled: false,
              href: '/playlists'
            },
            {
              text: 'Advanced',
              disabled: true, 
              href: '/advanced'
            }
          ]"
      divider=">"
    ></v-breadcrumbs>
    <v-card class="ma-3">
      <v-card-title>
        <v-layout row wrap>
          <v-flex v-for="btn in buttons" :key="btn.text">
            <v-btn class="success">{{ btn.text }}</v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-text>Identified contacts (Manager level and above) for 1 unique companies out of 2 total unique companies in this playlist.</v-card-text>
      <!-- Table Contacts Found (Managers and Above) -->
      <v-card-text>
        <div>
          <v-toolbar text color="white">
            <v-toolbar-title>Contacts Found (Managers and Above)</v-toolbar-title>
          </v-toolbar>
          <v-data-table
            :headers="headersContactsMAA"
            :items="desserts"
            class="elevation-3"
            item-key="name"
          >
            <template v-slot:items="props">
              <tr>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.calories }}</td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
      <!-- Contacts Found (Junior / Below Managers) -->
      <v-card-text>
        <div>
          <v-toolbar text color="white">
            <v-toolbar-title>Contacts Found (Junior / Below Managers)</v-toolbar-title>
          </v-toolbar>
          <v-data-table
            :headers="headersContactsMAA"
            :items="desserts"
            class="elevation-3"
            item-key="name"
          >
            <template v-slot:items="props">
              <tr>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.calories }}</td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
      <!-- Table Prospects by State -->
      <v-card-text>
        <div>
          <v-toolbar text color="white">
            <v-toolbar-title>Prospects by State</v-toolbar-title>
          </v-toolbar>
          <v-data-table
            :headers="headersContactsMAA"
            :items="desserts"
            class="elevation-3"
            item-key="name"
          >
            <template v-slot:items="props">
              <tr>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.calories }}</td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
      <!--  Table Custom Signals for playlist / Accuracy -->
      <v-card-text>
        <div>
          <v-toolbar text color="white">
            <v-toolbar-title>Custom Signals for playlist / Accuracy</v-toolbar-title>
          </v-toolbar>
          <v-data-table :headers="customSignalsForPlaylist" :items="desserts" class="elevation-3">
            <template v-slot:items="props">
              <tr>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.calories }}</td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
      <!-- Table Custom Signals for playlist by Signal -->
      <v-card-text>
        <div>
          <v-toolbar text color="white">
            <v-toolbar-title>Custom Signals for playlist by Signal</v-toolbar-title>
          </v-toolbar>
          <v-data-table :headers="customSignalsForPlaylistBySignal" :items="desserts" class="elevation-3">
            <template v-slot:items="props">
              <tr>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.calories }}</td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      buttons: [
        { text: "Playlist" },
        { text: "Stats" },
        { text: "Comments" },
        { text: "More News Signals" },
        { text: "Keywords and Themes" },
        { text: "Update Companies by Website" },
        { text: "Update Companies by Account Name" },
        { text: "Match with Corrent Lists" },
        { text: "Refresh Keywords" },
        { text: "Find Contacts" },
        { text: "Team Tracker" }
      ],
      headersContactsMAA: [{ text: "Department" }, { text: "Total" }],
      customSignalsForPlaylist: [
        { text: "Total" },
        { text: "Grand Total" },
        { text: "Percentage" }
      ],
      customSignalsForPlaylistBySignal: [
        { text: "Custom Signal" },
        { text: "Total" },
        { text: "Grand Total" },
        { text: "Percentage" }
      ]
    };
  }
};
</script>
