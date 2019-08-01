import Vue from "vue";
import Router from "vue-router";
import Home from "./views/dashboard/Dashboard.vue";
import PlayLists from "./views/playlists/PlayLists.vue";
import PlayListCompanies from "./views/playlists/PlayListCompanies.vue";
import Companies from "./views/companies/Companies.vue";
import Company from "./views/companies/Company.vue";
import NewCompanies from "./views/newcompanies/NewCompanies.vue";
import News from "./views/news/News.vue";
//Calibration
import Calibration from "./views/playlists/components/Advanced.vue";
import Login from "./views/Login.vue";
import Callback from "./components/Callback";
import auth from "./auth/authService";
import Signals from "./views/signals/Signals.vue";
import Signal from "./views/signals/components/Signal.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  // eslint-disable-next-line no-sparse-arrays
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/playlists",
      name: "playlists",
      component: PlayLists
    },
    {
      path: "/playlists/:playlistId/companies",
      name: "playlist-companies",
      component: PlayListCompanies
    },
    {
      path: "/companies",
      name: "companies",
      component: Companies
    },
    {
      path: "/news",
      name: "news",
      component: News
    },
    {
      path: "/companies/:companiesUid",
      name: "company",
      component: Company
    },
    {
      path: "/playlists/:playlistId/companies/:companiesUid",
      name: "playlist-company",
      component: Company
    },
    {
      path: "/advanced/:playlistId",
      name: "advanced",
      component: Calibration
    },
    {
      path: "/new-companies",
      name: "newcompanies",
      component: NewCompanies
    },
    {
      path: "/callback",
      name: "callback",
      component: Callback
    },
    {
      path: "/signals",
      name: "signals",
      component: Signals
    },
    {
      path: "/signals/create",
      name: "signal-create",
      component: Signal
    },
    {
      path: "/signals/:signalId",
      name: "signal",
      component: Signal
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path === "/callback" || auth.isAuthenticated()) {
    return next();
  }

  // Specify the current path as the customState parameter, meaning it
  // will be returned to the application after auth
  auth.login({ target: to.path });
});

export default router;
