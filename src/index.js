import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./client";
import Tasks from "./Tasks";

const App = () => (
  <ApolloProvider client={client}>
    <Tasks />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
