<template>
  <div>
    <v-card v-if="aggs_top_signals">
      <v-card-subtitle>
        <div class="headline">Top Signals</div>
      </v-card-subtitle>
      <v-card-text>
        <c3-chart :type="'bar'" :config="aggs_top_signals_config" :data="aggs_top_signals" />
      </v-card-text>
    </v-card>

    <v-card v-if="aggs_top_naics_code">
      <v-card-subtitle>
        <div class="headline">Top NAICS Descriptions</div>
      </v-card-subtitle>
      <v-card-text>
        <c3-chart :type="'bar'" :config="config" :data="aggs_top_naics_code" />
      </v-card-text>
    </v-card>

    <v-card v-if="aggs_employees_dist">
      <v-card-subtitle>
        <div class="headline">Employees Distribution</div>
      </v-card-subtitle>
      <v-card-text>
        <c3-chart :type="'bar'" :config="aggs_employees_dist_config" :data="aggs_employees_dist" />
      </v-card-text>
    </v-card>

     <v-card v-if="revenue_per_category">
      <v-card-subtitle>
        <div class="headline">Revenue per Category</div>
      </v-card-subtitle>
      <v-card-text>
        <c3-chart :type="'pie'" :config="revenue_per_category_config" :data="revenue_per_category" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import C3Chart from "../../../C3Chart.vue";
export default {
  props: {
    aggs_data: { type: Object, default: () => {} }
  },
  methods: {
    parse_agg_string: function(agg_string) {
      return agg_string.split("||").map(entry => {
        return entry.split(">>");
      });
    }
  },
  computed: {
    aggs_top_signals: function() {
      if (this.aggs_data.hasOwnProperty("aggs_top_signals")) {
        let agg_string_parsed = this.parse_agg_string(this.aggs_data.aggs_top_signals);
        let cols = agg_string_parsed.map(entry=>{
          return parseInt(entry[2])
        });
        return {
          columns: [cols]
        };
      }
      return null;
    },
    aggs_top_signals_config: function() {
      if (this.aggs_data.hasOwnProperty("aggs_top_signals")) {
        let agg_string_parsed = this.parse_agg_string(this.aggs_data.aggs_top_signals);
        return {
          tooltip: {
            horizontal: true,
            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
              return `<div style="background-color:#FFF; padding:0px 6px; border:1px solid #888; border-radius: 4px;">Value: ${d[0].value}</div>`;
            }
          },
          grid: {
            focus: {
              show: false
            }
          },
          bar: {
            space: 0.05
          },
          axis: {
            x: {
              type: "category",
              categories: agg_string_parsed.map(entry=>{
                return entry[1]
              })
            }
          },
          legend: {
            hide: true
          }
        };
      }
      return null;
    },
    aggs_top_naics_code: function() {
      if (this.aggs_data.hasOwnProperty("aggs_top_naics_code")) {
        return {
          columns: this.parse_agg_string(this.aggs_data.aggs_top_naics_code)
        };
      }
      return null;
    },
    aggs_employees_dist_config: function(){
      if (this.aggs_data.hasOwnProperty("aggs_employees_dist")) {
        let agg_string_parsed = this.parse_agg_string(this.aggs_data.aggs_employees_dist);
        return {
          tooltip: {
            horizontal: true,
            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
              return `<div style="background-color:#FFF; padding:0px 6px; border:1px solid #888; border-radius: 4px;">Value: ${d[0].value}</div>`;
            }
          },
          bar: {
            space: 0.05
          },
          grid: {
            focus: {
              show: false
            }
          },
          axis: {
            x: {
              type: "category",
              categories: agg_string_parsed.map(entry=>{
                switch(entry[0]){
                  case "0_50": return "<50";
                  case "50_100": return "50-100";
                  case "100_1000": return "100-1000";
                  case "1000_5000": return "1000-5000";
                  case "5000_": return ">5000";
                }
              })
            }
          },
          legend: {
            hide: true
          }
        };
      }
      return null;
    },
    aggs_employees_dist: function(){
      if (this.aggs_data.hasOwnProperty("aggs_employees_dist")) {
        let agg_string_parsed = this.parse_agg_string(this.aggs_data.aggs_employees_dist);
        let cols = agg_string_parsed.map(entry=>{
          return parseInt(entry[1]);
        });
        cols.unshift("x");
        return {
          columns: [cols]
        };
      }
      return null;
    },
    revenue_per_category_config: function(){
      return {};
    },
    revenue_per_category: function(){
      if (this.aggs_data.hasOwnProperty("revenue_per_category")) {
        return {
          columns: this.parse_agg_string(this.aggs_data.revenue_per_category)
        };
      }
      return null;
    }
  },
  components: {
    C3Chart
  }
};
</script>