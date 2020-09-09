import Vue from "vue";
import vuetify from "./plugins/vuetify";
import VuetifyConfirm from 'vuetify-confirm'
import App from "./App.vue";
import router from "./router";
import { createProvider } from "./vue-apollo";
import VueApexCharts from "vue-apexcharts";
import store from "./store";

Vue.component('apexchart', VueApexCharts)
Vue.config.productionTip = false;

Vue.use(VuetifyConfirm, { vuetify })
Vue.use(require('vue-moment'));


Vue.prototype.$eventBus = new Vue();

new Vue({
  vuetify,
  router,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount("#app");
