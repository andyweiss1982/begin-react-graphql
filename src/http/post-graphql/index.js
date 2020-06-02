const arc = require("@architect/functions");
const { ApolloServer, gql } = require("apollo-server-lambda");
const data = require("@begin/data");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const table = "tasks";
const secret = "secret";
const saltRounds = 10;

const typeDefs = gql`
  type Task {
    key: ID!
    description: String!
    createdAt: String!
  }
  type User {
    key: String!
    password: String!
    tasks: [Task]!
  }
  type JWT {
    token: String!
  }
  type Query {
    currentUser: User
    tasks: [Task]!
  }
  type Mutation {
    signup(email: String!, password: String!): JWT
    login(email: String!, password: String!): JWT
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
    signup: async (_, { email, password }) => {
      const existingUser = await data.get({ table: "users", key: email });
      if (existingUser) return;
      const hash = bcrypt.hashSync(password, saltRounds);
      const newUser = await data.set({
        table: "users",
        key: email,
        password: hash,
        tasks: [],
      });
      const token = jwt.sign(newUser, secret);
      return { token };
    },
    login: async (_, { email, password }) => {
      const user = await data.get({ table: "users", key: email });
      if (!user) return;
      const match = bcrypt.compareSync(password, user.password);
      if (!match) return;
      const token = jwt.sign(user, secret);
      return { token };
    },
    createTask: async (_, { description }) =>
      await data.set({ table, description, createdAt: +Date.now() }),
    deleteTask: async (_, { key }) => {
      const task = await data.get({ table, key });
      await data.destroy({ table, key });
      return task;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event }) => {
    const token = event.headers.authorization || "";
    let email;
    try {
      email = jwt.verify(token, secret).email || "";
    } catch (error) {
      email = "";
    }
    let user = await data.get({ table: "users", key: email });
    // data returns an empty array when email is empty
    if (Array.isArray(user) && !user.length) user = null;
    if (user) delete user.password;
    return { user };
  },
});

const handler = server.createHandler();

exports.handler = function (event, context, callback) {
  const body = arc.http.helpers.bodyParser(event);
  event.body = JSON.stringify(body);
  handler(event, context, callback);
};
