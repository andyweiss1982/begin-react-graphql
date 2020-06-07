const arc = require("@architect/functions");
const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require("apollo-server-lambda");
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
    user: User
  }
  type Mutation {
    signUp(email: String!, password: String!): JWT
    signIn(email: String!, password: String!): JWT
    createTask(description: String!): Task!
    deleteTask(key: ID!): Task!
  }
`;

const resolvers = {
  Query: { user: (_, __, { user }) => user },
  Mutation: {
    signUp: async (_, { email, password }) => {
      const existingUser = await data.get({ table, key: email });
      if (existingUser) throw new AuthenticationError("Email is taken");
      const newUser = await data.set({
        table,
        key: email,
        password: bcrypt.hashSync(password, saltRounds),
        tasks: [],
      });
      const token = jwt.sign(newUser, secret);
      return { token };
    },
    signIn: async (_, { email, password }) => {
      const user = await data.get({ table, key: email });
      if (!user) throw new AuthenticationError("Invalid email / password");
      const match = bcrypt.compareSync(password, user.password);
      if (!match) throw new AuthenticationError("Invalid email / password");
      const token = jwt.sign(user, secret);
      return { token };
    },
    createTask: async (_, { description }, { user }) => {
      const task = {
        key: uuidv4(),
        description,
        createdAt: +Date.now(),
      };
      const dbUser = await data.get({ table, key: user.key });
      await data.set({ ...dbUser, tasks: [...dbUser.tasks, task] });
      return task;
    },
    deleteTask: async (_, { key }, { user }) => {
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
    let user = null;
    if (token) {
      try {
        const { key } = jwt.verify(token, secret);
        user = await data.get({ table, key });
        if (user) delete user.password;
      } catch (error) {
        console.error(error.message);
      }
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
