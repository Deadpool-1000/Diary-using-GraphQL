import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "./Post.js";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      toLowerCase: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    posts: [mongoose.Schema.Types.ObjectId],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET, {
    expiresIn: '7d'
  });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) throw new Error("Invalid username or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid username or password");

  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log("Here ");
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});


//Deletes all the post associated with a user when the user is deleted
userSchema.pre("remove", async function (next) {
  await Post.deleteMany({ creator: this._id });
  next();
});


export const User = new mongoose.model("User", userSchema);
