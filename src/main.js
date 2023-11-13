import './index.css'
import './fonts.css'
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Apollo Client imports
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { createHttpLink } from '@apollo/client/link/http';
import { createApolloProvider } from '@vue/apollo-option';
import introspectionQueryResultData from '../src/fragmentTypes.json';

// Configure the Apollo cache with fragment matcher
const cache = new InMemoryCache({
  possibleTypes: introspectionQueryResultData.possibleTypes,
});

// Create the Apollo client instance
const apolloClient = new ApolloClient({
  cache,
  link: createHttpLink({ uri: 'https://api-ap-southeast-2.hygraph.com/v2/clotcrrejx17101uq61q6420n/master' }),
});

// Create the Apollo provider
const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});

// Create the Vue 3 app
const app = createApp(App);

app.use(apolloProvider); // Use the Apollo provider
app.use(router);

app.mount('#app');
