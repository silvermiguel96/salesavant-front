import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Dashboard.vue";
import ApolloExample from "./components/ApolloExample.vue";
import PlayLists from "./views/playlists/PlayLists.vue";
import PlayListCompanies from "./views/playlists/PlayListCompanies.vue";
import Companies from "./views/companies/Companies.vue";
import Company from "./views/companies/Company.vue";
import Search from "./views/search/Search.vue";
import SearchWithSignals from "./views/search/SearchWithSignals.vue";
import NewCompanies from "./views/newcompanies/NewCompanies.vue";
//Calibration
import Calibration from "./views/playlists/components/Advanced.vue";
import Login from "./views/Login.vue";
import Callback from "./components/Callback";
import auth from "./auth/authService";

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
      path: "/apollo-example",
      name: "apollo",
      component: ApolloExample
    },
    {
      path: "/advanced/:playlistId",
      name: "advanced",
      component: Calibration
    },
    {
      path: "/search",
      name: "search",
      component: Search
    },
    {
      path: "/search-with-signals",
      name: "searchwithsignals",
      component: SearchWithSignals
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
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
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path === "/" || to.path === "/callback" || auth.isAuthenticated()) {
    return next();
  }

  // Specify the current path as the customState parameter, meaning it
  // will be returned to the application after auth
  auth.login({ target: to.path });
});

export default router;
