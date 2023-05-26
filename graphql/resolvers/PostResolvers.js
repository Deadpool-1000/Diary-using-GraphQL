import { Post } from "../../mongoose/models/Post.js";
import { User } from "../../mongoose/models/User.js";
import mongoose from "mongoose";
export default {
  Query: {
    posts: async (parent, args, contextValue, info)=>{
        if(contextValue.user){
            const posts = await Post.find({creator:contextValue.user.id});
            const final_payload = [];
            
            posts.forEach(post => {
              console.log(post);
              final_payload.push({post,createdAt:post.createdAt.toISOString()})
            });
            return final_payload;

        } else {
          console.log("No such user");
        }
      }
  },
  Mutation: {
    addPost: async (parent, args, contextValue, info) => {
      if (contextValue.user) {
        const newPost = new Post({ ...args, creator: contextValue.user.id });
        const author = await User.findById(contextValue.user.id);
        author.posts.push(newPost);
        await author.save();
        return await newPost.save();
      }
    },
    deletePost:async (parent, args, contextValue, info) =>{
        if(contextValue.user){
            try {
                const id = args.id;
                const foundPost =await Post.findById(id);
                if(foundPost){
                    if(foundPost.creator.toString()===contextValue.user.id.toString()){
                        return await Post.findByIdAndDelete(foundPost.id);
                    }
                }
            } catch (error) {
                console.log(error);    
            }
        }
    }
  }
};
