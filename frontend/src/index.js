import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ApolloClient, InMemoryCache, ApolloProvider,createHttpLink } from '@apollo/client';
import { AuthContextProvider } from "./store/auth-context";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Bar from "./components/Bar";
import "bootstrap/dist/css/bootstrap.min.css";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthContextProvider>
      <BrowserRouter>
      <Bar />
        <App/>
        </BrowserRouter>
      </AuthContextProvider>
    </ApolloProvider>
  </React.StrictMode>
);
