const arc = require("@architect/functions");
const { ApolloServer, gql } = require("apollo-server-lambda");
const data = require("@begin/data");
const table = "tasks";

const typeDefs = gql`
  type Task {
    key: ID!
    description: String!
    createdAt: String!
  }
  type Query {
    tasks: [Task]!
  }
  type Mutation {
    createTask(description: String!): Task!
    deleteTask(key: ID!): Task!
  }
`;

const resolvers = {
  Query: {
    tasks: async () =>
      (await data.get({ table })).sort((a, b) => b.createdAt - a.createdAt),
  },
  Mutation: {
    createTask: async (_, { description }) =>
      await data.set({ table, description, createdAt: +Date.now() }),
    deleteTask: async (_, { key }) => {
      const task = await data.get({ table, key });
      await data.destroy({ table, key });
      return task;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const handler = server.createHandler();

exports.handler = function (event, context, callback) {
  const body = arc.http.helpers.bodyParser(event);
  // Body is now parsed, re-encode to JSON for Apollo
  event.body = JSON.stringify(body);
  handler(event, context, callback);
};
