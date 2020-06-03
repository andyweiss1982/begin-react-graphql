const arc = require("@architect/functions");
const { ApolloServer, gql } = require("apollo-server-lambda");
const data = require("@begin/data");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const table = "users";
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
    me: String
    tasks: [Task]!
  }
  type Mutation {
    signUp(email: String!, password: String!): JWT
    signIn(email: String!, password: String!): JWT
    createTask(description: String!): Task!
    deleteTask(key: ID!): Task!
  }
`;

const resolvers = {
  Query: {
    me: (_parent, _args, { user }) => (user ? user.key : null),
    tasks: (_parent, _args, { user }) => {
      return ((user && user.tasks) || []).sort(
        (a, b) => b.createdAt - a.createdAt
      );
    },
  },
  Mutation: {
    signUp: async (_parent, { email, password }) => {
      const existingUser = await data.get({ table, key: email });
      if (existingUser) return;
      const hash = bcrypt.hashSync(password, saltRounds);
      const newUser = await data.set({
        table,
        key: email,
        password: hash,
        tasks: [],
      });
      const token = jwt.sign(newUser, secret);
      return { token };
    },
    signIn: async (_parent, { email, password }) => {
      const user = await data.get({ table, key: email });
      if (!user) return;
      const match = bcrypt.compareSync(password, user.password);
      if (!match) return;
      const token = jwt.sign(user, secret);
      return { token };
    },
    createTask: async (_parent, { description }, { user }) => {
      const task = {
        key: uuidv4(),
        description,
        createdAt: +Date.now(),
      };
      const dbUser = await data.get({ table, key: user.key });
      await data.set({ ...dbUser, tasks: [...dbUser.tasks, task] });
      return task;
    },
    deleteTask: async (_parent, { key }, { user }) => {
      const task = user.tasks.find((task) => task.key === key);
      const dbUser = await data.get({ table, key: user.key });
      await data.set({
        ...dbUser,
        tasks: dbUser.tasks.filter((task) => task.key !== key),
      });
      return task;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event }) => {
    const token = event.headers.Authorization || "";
    let email, user;
    try {
      email = jwt.verify(token, secret).key;
    } catch (error) {
      console.error("Invalid JWT");
    }
    if (email) {
      user = await data.get({ table, key: email });
      if (user) delete user.password;
    }
    return { user };
  },
});

const handler = server.createHandler();

exports.handler = function (event, context, callback) {
  const body = arc.http.helpers.bodyParser(event);
  event.body = JSON.stringify(body);
  handler(event, context, callback);
};
