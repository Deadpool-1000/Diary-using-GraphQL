import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { AuthContextProvider } from "./store/auth-context";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Bar from "./components/Bar";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});
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
