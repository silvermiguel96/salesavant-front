<template>
  <v-row>
    <v-col v-if="aggs_top_signals" cols="12" md="6">
      <v-card>
        <v-card-subtitle>
          <div class="headline">Top Signals</div>
        </v-card-subtitle>
        <v-card-text>
          <apexchart
            type="bar"
            height="200"
            :options="aggs_top_signals.options"
            :series="aggs_top_signals.series"
          ></apexchart>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col v-if="aggs_top_naics_code" cols="12" md="6">
      <v-card>
        <v-card-subtitle>
          <div class="headline">Top NAICS Descriptions</div>
        </v-card-subtitle>
        <v-card-text></v-card-text>
      </v-card>
    </v-col>

    <v-col v-if="aggs_employees_dist" cols="12" md="6">
      <v-card>
        <v-card-subtitle>
          <div class="headline">Employees Distribution</div>
        </v-card-subtitle>
        <v-card-text>
          <apexchart
            type="bar"
            height="200"
            :options="aggs_employees_dist.options"
            :series="aggs_employees_dist.series"
          ></apexchart>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col v-if="revenue_per_category" cols="12" md="6">
      <v-card>
        <v-card-subtitle>
          <div class="headline">Revenue per Category</div>
        </v-card-subtitle>
        <v-card-text></v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <v-card>
        <v-card-subtitle>
          <div class="headline">Map</div>
        </v-card-subtitle>
        <v-card-text>
          <div class="map-wrapper" style="height:200px">
            <div id="map" class="jvectormap-container" style="width:100%"></div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
window.jQuery = require("jquery");
require("jvectormap");
require("../../../../../lib/jquery-jvectormap-world-mill-en.js");

export default {
  props: {
    aggs_data: { type: Object, default: () => {} },
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      console.log("initMap");
      const map = jQuery("#map");
      map.empty();
      map.vectorMap({
        map: "world_mill_en",

        backgroundColor: "transparent",
        zoomOnScroll: false,
        zoomOnButtons: false,
        regionStyle: {
          initial: {
            fill: "#e4e4e4",
            "fill-opacity": 0.9,
            stroke: "none",
            "stroke-width": 0,
            "stroke-opacity": 0,
          },
        },
        series: {
          regions: [
            {
              values: {US: 10.63, CO: 11.58, GB: 13},
              scale: ["#C8EEFF", "#0071A4"],
              normalizeFunction: "polynomial",
            },
          ],
        },
      });
    },
    parse_agg_string: function (agg_string) {
      return agg_string.split("||").map((entry) => {
        return entry.split(">>");
      });
    },
    getNumEmployeesDisplayName(num_employess) {
      switch (num_employess) {
        case "0_50":
          return "< 50";
        case "50_100":
          return "50-100";
        case "100_1000":
          return "100-1000";
        case "1000_5000":
          return "1000-5000";
        case "5000_":
          return "> 5000";
      }
    },
  },
  computed: {
    aggs_top_signals: function () {
      if (this.aggs_data.hasOwnProperty("aggs_top_signals")) {
        let agg_string_parsed = this.parse_agg_string(
          this.aggs_data.aggs_top_signals
        );
        let categories = [];
        let data = [];
        agg_string_parsed.forEach((entry) => {
          categories.push(entry[1]);
          data.push(parseInt(entry[2]));
        });
        return {
          options: {
            heigth: 300,
            chart: {
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              categories: categories,
              tickPlacement: "on",
            },
            plotOptions: {
              bar: {
                columnWidth: "50%",
              },
            },
          },
          series: [
            {
              name: "Top Signals",
              data: data,
            },
          ],
        };
      }
      return null;
    },
    aggs_top_naics_code: function () {
      if (this.aggs_data.hasOwnProperty("aggs_top_naics_code")) {
        return {
          columns: this.parse_agg_string(this.aggs_data.aggs_top_naics_code),
        };
      }
      return null;
    },
    aggs_employees_dist: function () {
      if (this.aggs_data.hasOwnProperty("aggs_employees_dist")) {
        let agg_string_parsed = this.parse_agg_string(
          this.aggs_data.aggs_employees_dist
        );
        let categories = [];
        let data = [];
        agg_string_parsed.forEach((entry) => {
          categories.push(this.getNumEmployeesDisplayName(entry[0]));
          data.push(parseInt(entry[1]));
        });
        return {
          options: {
            chart: {
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              categories: categories,
              tickPlacement: "on",
            },
            plotOptions: {
              bar: {
                columnWidth: "50%",
              },
            },
          },
          series: [
            {
              name: "Top Signals",
              data: data,
            },
          ],
        };
      }
      return null;
    },
    revenue_per_category: function () {
      if (this.aggs_data.hasOwnProperty("revenue_per_category")) {
        return {
          columns: this.parse_agg_string(this.aggs_data.revenue_per_category),
        };
      }
      return null;
    },
  },
  components: {},
};
</script>

<style lang="stylus">
.jvectormap-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  touch-action: none;
}
</style>