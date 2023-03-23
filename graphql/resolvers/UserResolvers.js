import { users, posts } from "../../db/falseDB.js";
import { User } from "../../mongoose/models/User.js";
import bcrypt from "bcrypt";
export default {
  Query: {
    users: async () => {
      return await User.find({});
    },
    usersById: async (parent, args, contextValue, info) => {
      return await User.findById(args.id);
    },
  },
  Mutation: {
    addUser: async (parent, args, contextValue, info) => {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(args.password, salt);
        const newUser = new User({ ...args, password: hashedPassword });
        return await newUser.save();
      } catch (error) {
        console.log(error);
      }
    },
  },
  User: {
    posts: (user) => {
      return posts.filter((post) => {
        return post.creator === user.id;
      });
    },
  },
};
