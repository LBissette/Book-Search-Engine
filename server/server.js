import express from "express";
import { ApolloServer } from "apollo-server-express";
import { join } from "path";
import { authMiddleware } from './utils/auth'

import { typeDefs, resolvers } from "./schemas";
import { once } from "./config/connection";

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const context = { req };
    return authMiddleware(context);
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "../client/build/index.html"));
});

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
  once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startApolloServer(typeDefs, resolvers);
