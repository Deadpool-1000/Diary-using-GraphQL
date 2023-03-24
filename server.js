import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import mergedResolvers from './graphql/resolvers/index.js';
import "./mongoose/conn.js";
import auth from './middleware/auth.js'
import * as dotenv from "dotenv"
dotenv.config()


const typeDefs = await loadSchema('./graphql/queries/index.graphql',{
  loaders:[new GraphQLFileLoader()]
});


const server = new ApolloServer({
  typeDefs,
  resolvers:mergedResolvers
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
  context: auth
});

console.log(`🚀 server listening at: ${url}`);
