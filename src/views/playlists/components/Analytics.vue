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
  </div>
</template>

<script>
import C3Chart from "../../../components/C3Chart";
export default {
  data() {
    return {
      topSignalsCategories: []
    };
  },
  props: {
    aggs_data: { type: Object, default: () => {} }
  },
  methods: {
    parse_aggs_top_signals: function(agg_string) {
      let temp = [];
      let counts = agg_string.split("||").map(entry => {
        let entrySplit = entry.split(">>");
        temp.push(entrySplit[1]);
        return parseInt(entrySplit[2]);
      });
      this.topSignalsCategories = temp;
      return counts;
    }
  },
  computed: {
    aggs_top_signals: function() {
      if (this.aggs_data.hasOwnProperty("aggs_top_signals")) {
        return {
          columns: [
            this.parse_aggs_top_signals(this.aggs_data.aggs_top_signals)
          ]
        };
      }
      return null;
    },

    aggs_top_signals_config: function() {
      if (this.aggs_data.hasOwnProperty("aggs_top_signals")) {
        return {
          tooltip: {
            show: false
          },
          bar: {
            space: 0.05
          },
          axis: {
            x: {
              type: "category",
              categories: this.topSignalsCategories,
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
    }
  },
  components: {
    C3Chart
  }
};
</script>