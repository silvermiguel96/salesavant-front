import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import ApolloExample from "./components/ApolloExample.vue";
import PlayLists from "./views/playlists/PlayLists.vue";
import PlayListCompanies from "./views/playlists/PlayListCompanies.vue";
import Companies from "./views/companies/Companies.vue";
import Company from "./views/companies/Company.vue";

//Calibration
import Calibration from "./views/playlists/components/Advanced.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
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
      name: "company",
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
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
