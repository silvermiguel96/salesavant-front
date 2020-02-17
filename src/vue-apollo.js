import Vue from "vue";
import VueApollo from "vue-apollo";
import {
  createApolloClient,
  restartWebsockets
} from "vue-cli-plugin-apollo/graphql-client";
import { AUTH_TOKEN, getAuthHeader } from "./util";

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
  tokenName: AUTH_TOKEN,
  getAuth: getAuthHeader,
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
      if (error.networkError.statusCode === 401){
        localStorage.removeItem(AUTH_TOKEN);
      }
    }
  });

  return apolloProvider;
}

// Manually call this when user log in
export async function onLogin(apolloClient, token) {
  if (typeof localStorage !== "undefined" && token) {
    localStorage.setItem(AUTH_TOKEN, token);
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
    localStorage.removeItem(AUTH_TOKEN);
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("%cError on cache reset (logout)", "color: orange;", e.message);
  }
}
