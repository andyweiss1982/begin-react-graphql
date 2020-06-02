import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./graphql-client";
import Auth from "./Auth";
import Tasks from "./Tasks";

const App = () => (
  <ApolloProvider client={client}>
    <Auth>
      <Tasks />
    </Auth>
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
