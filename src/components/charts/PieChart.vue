import { Pie } from "vue-chartjs"

export default {
  extends: Pie,
  mounted () {
    this.renderChart(data, options)
  }
}