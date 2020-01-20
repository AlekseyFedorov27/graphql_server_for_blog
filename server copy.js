const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// const filePath = path.join(__dirname, "typeDefs.gql");
// // const typeDefs = require("./typeDefs.gql");
// const typeDefs = fs.readFileSync(filePath, "utf-8");

require("dotenv").config({ path: "variables.env" });
const User = require("./models/User");
const Post = require("./models/Post");

const user = "alex277";
const password = "02030405060708";
const claster = "google";

mongoose.connect(
  `mongodb+srv://${user}:${password}@cluster0-yn85g.gcp.mongodb.net/${claster}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    dbName: "google"
  }
);

const typeDefs = `
type User {
  _id: ID
  username: String! @unique
  email: String!
  password: String!
  avatar: String
  joinDate: String
  favorites: [Post]
}

type Post {
  title: String!
  imageUrl: String!
  categories: [String]!
  description: String!
  createdDate: String
  likes: Int
  createdBy: User!
  messages: [Message]
}

type Message {
  _id: ID
  messageBody: String!
  messageDate: String
  messageUser: User!
}
`;
// const todos = [
//   { task: "Wash car", completed: false },
//   { task: "Clean room", completed: true }
// ];

// const typeDefs = gql`
//   type Todo {
//     task: String
//     completed: Boolean
//   }

//   type Query {
//     getTodos: [Todo]
//   }

//   type Mutation {
//     addTodo(task: String, completed: Boolean): Todo
//   }
// `;

// const resolvers = {
//   Query: {
//     getTodos: () => todos
//   },
//   Mutation: {
//     addTodo: (_, { task, completed }) => {
//       const todo = { task, completed };
//       todos.push(todo);
//       return todo;
//     }
//   }
// };

const server = new ApolloServer({
  typeDefs,
  context: {
    User,
    Post
  }
});

const dbConnection = mongoose.connection;
dbConnection.on("error", err => console.log(`Connection error: ${err}`));
dbConnection.once("open", () => console.log("Connected to DataBase!"));

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
