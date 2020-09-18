import Vue from "vue";
import vuetify from "./plugins/vuetify";
import VuetifyConfirm from "vuetify-confirm";
import router from "./router";
import store from "./store";
import { createProvider } from "./vue-apollo";
import VueApexCharts from "vue-apexcharts";
import App from "./App.vue";

Vue.config.productionTip = false;
Vue.prototype.$eventBus = new Vue();

Vue.use(VuetifyConfirm, { vuetify })
Vue.use(require("vue-moment"));
Vue.component("apexchart", VueApexCharts)

new Vue({
  vuetify,
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount("#app");
