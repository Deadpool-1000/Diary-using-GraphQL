import { users, posts } from "../../db/falseDB.js";
import { User } from "../../mongoose/models/User.js";
import {Post} from "../../mongoose/models/Post.js";
export default {
  Query: {
    users: async () => {
      return await User.find({});
    },
    usersById: async (parent, args, contextValue, info) => {
      return await User.findById(args.id);
    }
  },
  Mutation: {
    addUser: async (parent, args, contextValue, info) => {
      try {
        const newUser = new User({ ...args });
        return await newUser.save();
      } catch (error) {
        return null;
      }
    },
    login: async (parent, {username,password}, contextValue, info) => {
      try {
        const foundUser = await User.findByCredentials(username, password);
        const token = await foundUser.generateAuthToken();
        return {
          user: foundUser,
          token,
        };
      } catch (error) {
        return null;
      }
    },
    logout:async (parent, args, contextValue, info)=>{
      const token = contextValue.token;
      try {
        const foundUser = await User.findById(contextValue.user.id);
        if(!foundUser){
          return "Unauthorized"
        }
        foundUser.tokens=foundUser.tokens.filter((tk) => {
          return tk.token !== token;
        });
        await foundUser.save();
        return "Success";
      } catch (error) {
          return "Unauthorized"
      }
    }
  },
  User: {
    posts: async (user) => {
      return await Post.find({creator:user.id})
    },
  }
};
