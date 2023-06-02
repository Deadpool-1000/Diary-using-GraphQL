import { User } from "../../mongoose/models/User.js";
import { Post } from "../../mongoose/models/Post.js";
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
       throw new error("There was an error saving the user")
      }
    },
    login: async (parent, { username, password }, contextValue, info) => {
      try {
        //Static method returns user by email and password
        const foundUser = await User.findByCredentials(username, password);
        //Schema-methods that returns a token from "this" user's id
        const token = await foundUser.generateAuthToken();
        return {
          user: foundUser,
          token,
          expiresIn: parseInt(process.env.EXPIRES_IN)
        };
      } catch (error) {
        throw new Error(error.message)
      }
    },
    logout: async (parent, args, contextValue, info) => {
      if (contextValue.isLoggedIn) {
        const token = contextValue.token;
        try {
          const foundUser = await User.findById(contextValue.user.id);
          if (!foundUser) {
            return "Unauthorized"
          }
          foundUser.tokens = foundUser.tokens.filter((tk) => {
            return tk.token !== token;
          });
          await foundUser.save();
          return "Success";
        } catch (error) {
          throw new error("Could'nt logout");
        }
      } else {
        throw new Error("Please Authenticate yourself!");
      }
    }
  },
  User: {
    posts: async (user) => {
      return await Post.find({ creator: user.id })
    },
  }
};
