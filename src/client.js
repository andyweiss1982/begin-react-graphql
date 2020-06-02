import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

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

const client = new ApolloClient({ uri: "/graphql" });

export default client;
