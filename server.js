import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import mergedResolvers from "./graphql/resolvers/index.js";
import auth from "./middleware/auth.js";
import * as dotenv from "dotenv";
dotenv.config();

//MongoDB config
import connector from "./mongoose/conn.js"; 
connector(process.env.APOLLO_MONGOOSE_URI) 


//type/schema defination
const typeDefs = await loadSchema("./graphql/queries/index.graphql", {
  loaders: [new GraphQLFileLoader()],
});

//server-creation
const server = new ApolloServer({
  typeDefs,
  resolvers: mergedResolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
  context: async ({ req, res }) => {
    try {
      const token = req.headers.authorization || "";
      if(token.length===0){
        return {isLoggedIn:false}
      }
      const user = await auth(token);
      return { user,token,isLoggedIn:true };
    } catch (e) {
      console.log(e);
    }
  },
});

console.log(`🚀 server listening at: ${url}`);
