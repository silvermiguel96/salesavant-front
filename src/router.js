/* eslint-disable no-extra-boolean-cast */
import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/dashboard/Dashboard.vue";

import Companies from "./views/companies/Companies.vue";
import Company from "./views/companies/Company.vue";

import Playlists from "./views/playlists/Playlists.vue";
import Playlist from "./views/playlists/Playlist.vue";

import Contacts from "./views/contacts/Contacts.vue";
import Contact from "./views/contacts/Contact.vue"

import Signals from "./views/signals/Signals.vue";
import Signal from "./views/signals/Signal.vue";

import BatchJobs from "./views/batch/BatchJobs.vue";
import LaunchJob from "./views/batch/LaunchJob.vue";

import SalesforceAuthorize from "./views/salesforce/Authorize.vue";
import SalesforceCallback from "./views/salesforce/Callback.vue";

import { AUTH_TOKEN } from "./util";

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
      path: "/companies",
      name: "companies",
      component: Companies,
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
      path: "/playlists",
      name: "playlists",
      component: Playlists,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/playlists/:playlistUid",
      name: "playlist",
      component: Playlist,
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
      path: "/contacts",
      name: "Contacts",
      component: Contacts,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/contacts/:contactUid",
      name: "contact",
      component: Contact,
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
    },
    {
      path: "/batch",
      name: "batch",
      component: BatchJobs,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/launch-job",
      name: "launch-job",
      component: LaunchJob,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/oauth/salesforce",
      name: "salesforce",
      component: SalesforceAuthorize,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/oauth/salesforce/ok",
      name: "salesforceOk",
      component: SalesforceCallback,
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