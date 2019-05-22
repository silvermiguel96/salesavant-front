import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import ApolloExample from "./components/ApolloExample.vue";
import PlayLists from "./views/playlists/PlayLists.vue";
import Companies from "./views/companies/Companies.vue";
import Company from "./views/companies/Company.vue";

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
      path: "/companies",
      name: "companies",
      component: Companies
    },
    {
      path: "/companies/:id",
      name: "company",
      component: Company
    },
    {
      path: "/apollo-example",
      name: "apollo",
      component: ApolloExample
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
