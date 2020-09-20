import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";
import { LIGHT_COLORS } from "./theme.js";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    light: true,
    options: {
      customProperties: true,
    },
    themes: {
      light: LIGHT_COLORS
    },
  },
  icons: {
    iconfont: "md"
  }
});
