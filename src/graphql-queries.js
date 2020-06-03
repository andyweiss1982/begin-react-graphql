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
