import Vue from "vue";
import VueApollo from "vue-apollo";
import {
  createApolloClient,
  restartWebsockets
} from "vue-cli-plugin-apollo/graphql-client";
import store from "./store";
import router from "./router"

// Install the vue plugin
Vue.use(VueApollo);

// Http endpoint
const httpEndpoint = process.env.VUE_APP_GRAPHQL_API_URL;
// Files URL root
export const filesRoot =
  process.env.VUE_APP_FILES_ROOT ||
  httpEndpoint.substr(0, httpEndpoint.indexOf("/graphql"));

Vue.prototype.$filesRoot = filesRoot;

// Config
const defaultOptions = {
  httpEndpoint,
  inMemoryCacheOptions: {
    freezeResults: false
  },
  wsEndpoint: null,
  $loadingKey: "loading",
  tokenName: "jwt-token",
  getAuth: () => `Bearer ${store.state.userToken}`,
  persisting: false,
  websocketsOnly: false,
  ssr: false
};

// Call this in the Vue app file
export function createProvider(options = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options
  });
  apolloClient.wsClient = wsClient;
  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        fetchPolicy: 'network-only',
      }
    },
    errorHandler(error) {
      console.log("%cError", "background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;", error.message);
      if (error.networkError.statusCode === 401) {
        store.commit("resetSession");
        router.push({ path: "login" });

      }
      if (error.networkError.statusCode === 422) {
        console.log("%cError", "background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;", "Bad Token");
        store.commit("resetSession");
        router.push({ path: "login" });

      }
    }
  });

  return apolloProvider;
}

// Manually call this when user log in
export async function onLogin(apolloClient, token) {
  if (typeof localStorage !== "undefined" && token) {
    store.commit("resetSession");
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("%cError on cache reset (login)", "color: orange;", e.message);
  }
}

// Manually call this when user log out
export async function onLogout(apolloClient) {
  if (typeof localStorage !== "undefined") {
    store.commit("resetSession");
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("%cError on cache reset (logout)", "color: orange;", e.message);
  }
}
