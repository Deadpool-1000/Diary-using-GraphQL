import { Post } from "../../mongoose/models/Post.js";
import { User } from "../../mongoose/models/User.js";
export default {
  Query: {
    posts: async (parent, args, contextValue, info) => {
      if (contextValue.isLoggedIn) {
        const posts = await Post.find({ creator: contextValue.user.id });
        const final_payload = [];
        posts.forEach(post => {
          final_payload.push({ post, createdAt: post.createdAt.toISOString() })
        });
        return final_payload;

      } else {
        throw new Error("Please Authenticate yourself")
      }
    }
  },
  Mutation: {
    addPost: async (parent, args, contextValue, info) => {
      if (contextValue.isLoggedIn) {
        const newPost = new Post({ ...args, creator: contextValue.user.id });
        const author = await User.findById(contextValue.user.id);
        author.posts.push(newPost);
        await author.save();
        return await newPost.save();
      } else {
        throw new Error("Please Authenticate yourself")
      }
    },
    deletePost: async (parent, args, contextValue, info) => {
      if (contextValue.isLoggedIn) {
        try {
          const id = args.id;
          const foundPost = await Post.findById(id);
          if (foundPost) {
            if (foundPost.creator.toString() === contextValue.user.id.toString()) {
              return await Post.findByIdAndDelete(foundPost.id);
            } else {
              throw new Error("You are not authorized to delete this post")
            }
          }
        } catch (error) {
          throw new Error("There was a problem deleting your post!")
        }
      } else {
        throw new Error("Please Authenticate yourself")
      }
    }
  }
};
