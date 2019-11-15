/* eslint-disable no-extra-boolean-cast */
import Vue from "vue";
import Router from "vue-router";
import Home from "./views/dashboard/Dashboard.vue";
import PlayLists from "./views/playlists/PlayLists.vue";
import PlayListCompanies from "./views/playlists/PlayListCompanies.vue";
import Companies from "./views/companies/Companies.vue";
import Company from "./views/companies/Company.vue";
import NewCompanies from "./views/newcompanies/NewCompanies.vue";
import News from "./views/news/News.vue";
import Jobs from "./views/jobs/Jobs.vue";
import SingleNews from "./views/news/components/SingleNews.vue"
import Calibration from "./views/playlists/components/Advanced.vue";
import Login from "./views/Login.vue";
import Signals from "./views/signals/Signals.vue";
import Signal from "./views/signals/components/Signal.vue";
import { AUTH_TOKEN } from "./vue-apollo";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "*",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/jobs",
      name: "jobs",
      component: Jobs,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/playlists",
      name: "playlists",
      component: PlayLists,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/playlists/:playlistUID/companies",
      name: "playlist-companies",
      component: PlayListCompanies,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/companies",
      name: "companies",
      component: Companies,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/news",
      name: "news",
      component: News,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/news/:newsId",
      name: "oneNews",
      component: SingleNews,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/companies/:companiesUid",
      name: "company",
      component: Company,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/playlists/:playlistId/companies/:companiesUid",
      name: "playlist-company",
      component: Company,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/advanced/:playlistId",
      name: "advanced",
      component: Calibration,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/new-companies",
      name: "newcompanies",
      component: NewCompanies,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/signals",
      name: "signals",
      component: Signals,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/signals/create",
      name: "signal-create",
      component: Signal,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/signals/:signalId",
      name: "signal",
      component: Signal,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem(AUTH_TOKEN)) {
      next({
        path: "/login"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
