import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { users,posts } from "./db/falseDB.js";
const typeDefs = await loadSchema('./graphql/queries/index.graphql',{
  loaders:[new GraphQLFileLoader()]
});
const resolvers = {
  Query: {
    users: () => users,
  },
  User:{
    posts:(user)=>{
      posts.filter(post=>{
        post.id
      });
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
});

console.log(`🚀 server listening at: ${url}`);
