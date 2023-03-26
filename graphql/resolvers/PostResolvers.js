import { Post } from "../../mongoose/models/Post.js";
import mongoose from "mongoose";
export default {
  Query: {
    posts: async (parent, args, contextValue, info)=>{
        if(contextValue.user){
            const posts = await Post.find({creator:contextValue.user._id});
            return posts;
        } 
      }
  },
  Mutation: {
    addPost: async (parent, args, contextValue, info) => {
      if (contextValue.user) {
        const newPost = new Post({ ...args, creator: contextValue.user.id });
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
