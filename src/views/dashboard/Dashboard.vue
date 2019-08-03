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
    <custom-signal-groups />
    <!-- Custom Sales Signals -->
    <table-custom-sales-signals />
  </v-card>
</template>

<script>
import ButtonsDashboard from "../../components/Dashboard/ButtonsDashboard.vue";
import TableCustomSalesSignals from "./components/CustomSalesSignals.vue";
import CustomSignalGroups from "./components/CustomSignalGroups.vue";
export default {
  components: {
    ButtonsDashboard,
    TableCustomSalesSignals,
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
