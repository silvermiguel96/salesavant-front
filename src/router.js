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

import Account from "./views/account/Account.vue"
import Salesforce from "./views/account/Salesforce.vue"
import Admin from "./views/account/Admin.vue"
import CompaniesScore from "./views/companies/CompaniesScore.vue";
import CompaniesAdmin from "./views/admin/company/Companies.vue"
import CompanyAdmin from "./views/admin/company/Company.vue"

import SalesforceSetupWizard from "./views/salesforce/SetupWizard.vue"
import SalesforceObject from "./views/salesforce/Objects.vue"
import salesforceDocumentation from "./views/documentation/Documentation.vue"

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
        requiresAuth: false
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
      path: "/account",
      name: "account",
      component: Account,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/salesforce",
      name: "Salesforce",
      component: Salesforce,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/admin",
      name: "Admin",
      component: Admin,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/companies-score",
      name: "Companies Score",
      component: CompaniesScore,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/companies-admin",
      name: "companies admin",
      component: CompaniesAdmin,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/companies-admin/:companiesUid",
      name: "company admin",
      component: CompanyAdmin,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/salesforce-setup",
      name: "Salesforce Setup",
      component: SalesforceSetupWizard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/oauth/salesforce",
      name: "salesforceOauth",
      component: SalesforceAuthorize,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/oauth/salesforce/ok",
      name: "salesforceOauthOk",
      component: SalesforceCallback,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/salesforce-objects",
      name: "salesforceObjects",
      component: SalesforceObject,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/salesforce-documentation",
      name: "salesforceDocumentation",
      component: salesforceDocumentation,
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