import { users, posts } from "../../db/falseDB.js";
import { User } from "../../mongoose/models/User.js";
export default {
  Query: {
    users: async () => {
      return await User.find({});
    },
    usersById: async (parent, args, contextValue, info) => {
      return await User.findById(args.id);
    },
    protect:(parent, args, contextValue, info)=>{
      if(contextValue.user){
        console.log("Success");
      } else {
        console.log("Unsuccess");
      }
      return "Done"
    }
  },
  Mutation: {
    addUser: async (parent, args, contextValue, info) => {
      try {
        const newUser = new User({ ...args });
        return await newUser.save();
      } catch (error) {
        console.log(error);
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
        console.log(error);
      }
    }
  },
  User: {
    posts: (user) => {
      return posts.filter((post) => {
        return post.creator === user.id;
      });
    },
  },
};
