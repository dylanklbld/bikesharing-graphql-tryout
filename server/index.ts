import { ApolloServer, gql } from "apollo-server-express";

import {cookieMiddleware} from "./src/middlewares/cookieMiddleware"
import cors from 'cors'
import express from "express";
import http from 'http'
import { initSessionUser } from "./src/middlewares/initializeUserMiddleware"
import mongoose from "mongoose";
import { resolvers } from "./src/graphql/resolvers";
import { typeDefs } from "./src/graphql/typeDefs";

const startServer = async () => {
  const app = express();

  app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
  }))
  
  app.use(cookieMiddleware);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context({ res }) {
        return {
          cookies: res?.locals?.cookie,
        };
    },
    subscriptions: {
      path: '/subscriptions'
    },
  });
 
  await mongoose.connect("mongodb://mongoadmin:secret@localhost:27888/rent-bikes", {
    useNewUrlParser: true
  });

  app.use(initSessionUser)

  server.applyMiddleware({ app, cors:false });
  
  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();