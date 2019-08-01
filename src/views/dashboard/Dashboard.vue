<template>
  <v-card class="ma-3">
    <v-card-title>
      <div class="headline">Dashboard</div>
      <v-spacer></v-spacer>
      <div class="headline">Dashboard</div>
    </v-card-title>
    <v-layout>
      <v-flex md4>
        <v-card-text>
          <v-sheet color="light-blue darken-2">
            <v-sparkline
              :value="value"
              color="rgba(255, 255, 255, .7)"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
            >
              <template v-slot:label="item">${{ item.value }}</template>
            </v-sparkline>
          </v-sheet>
        </v-card-text>
        <v-card-text>
          <div class="headline font-weight-thin">Mgmt Changes</div>
        </v-card-text>
      </v-flex>
      <v-flex md4>
        <v-card-text>
          <v-sheet color="blue lighten-2">
            <v-sparkline
              :value="value"
              color="rgba(255, 255, 255, .7)"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
            >
              <template v-slot:label="item">${{ item.value }}</template>
            </v-sparkline>
          </v-sheet>
        </v-card-text>
        <v-card-text>
          <div class="headline font-weight-thin">Funding Event</div>
        </v-card-text>
      </v-flex>
      <v-flex md4>
        <v-card-text>
          <v-sheet color="amber lighten-2">
            <v-sparkline
              :value="value"
              color="rgba(255, 255, 255, .7)"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
            >
              <template v-slot:label="item">${{ item.value }}</template>
            </v-sparkline>
          </v-sheet>
        </v-card-text>
        <v-card-text>
          <div class="headline font-weight-thin">Acquisitions</div>
        </v-card-text>
      </v-flex>
      <v-flex md4>
        <v-card-text>
          <v-sheet color="deep-orange lighten-2">
            <v-sparkline
              :value="value"
              color="rgba(255, 255, 255, .7)"
              height="100"
              padding="24"
              stroke-linecap="round"
              smooth
            >
              <template v-slot:label="item">${{ item.value }}</template>
            </v-sparkline>
          </v-sheet>
        </v-card-text>
        <v-card-text>
          <div class="headline font-weight-thin">Partnerships</div>
        </v-card-text>
      </v-flex>
    </v-layout>
    <!-- Buttons Dashboard  -->
    <buttons-dashboard></buttons-dashboard>
    <!-- Custom Signal Groups -->

    <!--TODOLISTO: crear como componente dentro de una carpeta nueva que se llame Dashboard-->
    <!--TODOLISTO: el nombre de cada grupo debe de ser un router link que lleve a 
    http://localhost:8080/signals?search=&group={nombre del grupo}&category=&searchType=signals-->
    <custom-signal-groups></custom-signal-groups>
    <!-- TODOLISTO: query para popular esta tabla es:
        signalsGroupAggs {
          id
          group
          creationTime
          totalCompanies
          modificationTime
        }-->
    <!-- Custom Sales Signals-->
    <!--TODO: crear como componente dentro de una carpeta nueva que se llame Dashboard-->
    <v-card-text>
      <v-toolbar flat color="white">
        <v-toolbar-title>Custom Sales Signals</v-toolbar-title>
      </v-toolbar>
      <!-- TODO: query para popular esta tabla es:
        signalsAggs {
          signal {
            id
            name
            defaultScore
            group
          }
          totalCompanies
      }-->
      <v-data-table :headers="headersSignals" class="elevation-1" :items="items">
        <!-- TODO: el nombre de cada signal debe ser un router link que lleve a la signal-->
        <template v-slot:items="props"></template>
      </v-data-table>
    </v-card-text>
    <v-card-text>
      <v-toolbar flat color="white">
        <v-toolbar-title>Signal Search</v-toolbar-title>
      </v-toolbar>
      <p class="subheading ml-2">Unbelievable. No entries here so far</p>
    </v-card-text>
  </v-card>
</template>

<script>
import ButtonsDashboard from "../../components/Dashboard/ButtonsDashboard.vue";
import CustomSignalGroups from "./components/CustomSignalGroups.vue";
export default {
  components: {
    ButtonsDashboard,
    CustomSignalGroups
  },
  data() {
    return {
      items: [],
      value: [423, 446, 675, 510, 590, 610, 760],
      headers: [
        { text: "Groups (All)", value: "groups" },
        { text: "All", value: "all" },
        { text: "Count", value: "count" }
      ],
      headersSignals: [
        { text: "Custom Signal", value: "customsignal" },
        { text: "Count", value: "count" },
        { text: "Score", value: "score" },
        { text: "Group", value: "signalgropup" }
      ]
    };
  }
};
</script>
