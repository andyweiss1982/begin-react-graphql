import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./graphql-client";
import { AuthProvider } from "./Authentication";
import Authorization from "./Authorization";
import Tasks from "./Tasks";

const App = () => (
  <ApolloProvider client={client}>
    <AuthProvider>
      <Authorization>
        <Tasks />
      </Authorization>
    </AuthProvider>
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
