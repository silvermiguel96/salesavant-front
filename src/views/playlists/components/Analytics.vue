<template>
  <div>
    <v-card v-if="aggs_top_signals">
      <v-card-subtitle>
        <div class="headline">Top Signals</div>
      </v-card-subtitle>
      <v-card-text>
        <c3-chart :config="config" :type="'bar'" :data="aggs_top_signals" />
      </v-card-text>
    </v-card>

    <v-card v-if="aggs_top_naics_code">
      <v-card-subtitle>
        <div class="headline">Top NAICS Descriptions</div>
      </v-card-subtitle>
      <v-card-text>
        <c3-chart :config="config" :type="'bar'" :data="aggs_top_naics_code" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import C3Chart from "../../../components/C3Chart";
export default {
  props: {
    config: {
      bar: {
        width: {
          ratio: 0.5
        }
      }
    },
    aggs_data: { type: Object, default: () => {} }
  },
  methods: {
    parse_agg_string: function(agg_string) {
      return agg_string.split("||").map(entry => {
        let entrySplit = entry.split(">>");
        return [entrySplit[0], parseInt(entrySplit[1])];
      });
    }
  },
  computed: {
    aggs_top_signals: function() {
      if (this.aggs_data.hasOwnProperty("aggs_top_signals")) {
        return {
          columns: this.parse_agg_string(this.aggs_data.aggs_top_signals)
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