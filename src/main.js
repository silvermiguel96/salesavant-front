import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import { createProvider } from "./vue-apollo";
import AuthPlugin from "./plugins/auth";

Vue.use(AuthPlugin);
Vue.config.productionTip = false;

new Vue({
  router,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount("#app");
