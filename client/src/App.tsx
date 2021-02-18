import './App.css';

import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client';

import React from 'react';
import RentBikeMap from './views/RentBikeMap';
import UserContextProvider from './contextProviders/UserContextProviders'
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from "@apollo/client/link/error";

function App() {


  const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/subscriptions',
    options: {
      reconnect: true,
      connectionParams: {
        credentials: 'include',
     },
    }
  });

  const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: 'include', // this part indicates the server that we would need to pass cookie info for each request
  });

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});


const client = new ApolloClient({
  link:ApolloLink.from([ errorLink, splitLink]),
  credentials: 'include',
  cache: new InMemoryCache()
});


  return (
    <ApolloProvider client={client}>
      <UserContextProvider>
        <div className="App">
          <RentBikeMap />
        </div>
      </UserContextProvider>
    </ApolloProvider>
  );
}

export default App;
