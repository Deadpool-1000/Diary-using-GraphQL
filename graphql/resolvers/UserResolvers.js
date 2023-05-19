import { users, posts } from "../../db/falseDB.js";
import { User } from "../../mongoose/models/User.js";
import {Post} from "../../mongoose/models/Post.js";
export default {
  Query: {
    users: async () => {
      return await User.find({});
    },
    profile: async (parent, args, contextValue, info) => {
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
        // contextValue.res.cookie("token", token, {
        //   httpOnly: true,
        //   secure: true,
        //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        // });
        return {
          user: foundUser,
          token,
          expiresIn:7*24*60*60
        };
      } catch (error) {
        console.log(error);
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
    },
    
  },
  User: {
    posts: async (user) => {
      return await Post.find({creator:user.id})
    },
  }
};
