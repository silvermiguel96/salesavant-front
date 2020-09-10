<template>
  <v-row class="ma-md-1">
    <v-col v-if="aggs_top_signals" cols="12" md="6">
      <v-card>
        <v-card-subtitle>
          <div class="subtitle-1">Top Signals</div>
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
          <div class="subtitle-1">Top NAICS Descriptions</div>
        </v-card-subtitle>
        <v-card-text></v-card-text>
      </v-card>
    </v-col>

    <v-col v-if="aggs_employees_dist" cols="12" md="6">
      <v-card>
        <v-card-subtitle>
          <div class="subtitle-1">Employees Distribution</div>
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
          <div class="subtitle-1">Revenue per Category</div>
        </v-card-subtitle>
        <v-card-text></v-card-text>
      </v-card>
    </v-col>

    <v-col v-if="aggs_top_countries" cols="12" md="6">
      <v-card>
        <v-card-subtitle>
          <div class="subtitle-1">Map</div>
        </v-card-subtitle>
        <v-card-text>
          <div class="map-wrapper" style="height:240px">
            <div id="map" class="jvectormap-container"></div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
window.jQuery = require("jquery");
require("jvectormap");
require("@/lib/jquery-jvectormap-world-mill-en.js");

import { find_country_code } from "@/commons.js";

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
      let countries = this.aggs_top_countries;
      if (countries) {
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
                values: countries,
                scale: ["#C8EEFF", "#008ffb"],
                normalizeFunction: "polynomial",
              },
            ],
          },
          onRegionTipShow: function (e, el, code) {
            if (code in countries) {
              el.html(el.html() + " - " + countries[code]);
            } else {
              el.html(el.html() + " - 0");
            }
          },
        });
      }
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
            yaxis: {
              reversed: true,
              axisTicks: {
                show: true,
              },
            },
            plotOptions: {
              bar: {
                columnWidth: "50%",
                horizontal: true,
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
    aggs_top_countries: function () {
      if (this.aggs_data.hasOwnProperty("aggs_top_countries")) {
        let agg_string_parsed = this.parse_agg_string(
          this.aggs_data.aggs_top_countries
        );
        let countries = {};
        agg_string_parsed.forEach((entry) => {
          console.log(entry);
          let country_code = find_country_code(entry[0]);
          if (country_code) {
            countries[country_code] = parseInt(entry[1]);
          }
        });
        return countries;
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

.jvectormap-tip {
  position: absolute;
  display: none;
  border: solid 1px #CDCDCD;
  border-radius: 3px;
  background: #FFF;
  color: #888;
  font-family: sans-serif, Verdana;
  font-size: smaller;
  padding: 3px;
}
</style>