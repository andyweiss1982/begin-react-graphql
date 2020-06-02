import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { gql } from "apollo-boost";

export const ME_QUERY = gql`
  query Me {
    me
  }
`;

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      token
    }
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
    }
  }
`;

export const TASKS_QUERY = gql`
  query Tasks {
    tasks {
      key
      description
      createdAt
    }
  }
`;

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($description: String!) {
    createTask(description: $description) {
      key
      description
      createdAt
    }
  }
`;

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($key: ID!) {
    deleteTask(key: $key) {
      key
      description
      createdAt
    }
  }
`;

const httpLink = createHttpLink({ uri: "/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token || "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
