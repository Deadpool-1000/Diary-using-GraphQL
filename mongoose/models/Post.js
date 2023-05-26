import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  creator : {
    type:mongoose.Schema.Types.ObjectId
  }
},
{
  timestamps: true,
});

export const Post = new mongoose.model("Post",postSchema);