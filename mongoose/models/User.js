import mongoose from "mongoose";
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
  },
  {
    timestamps: true,
  }
);


userSchema.methods.generateAuthToken = async function () {
  //Called on instance called instance methods
  const token = jwt.sign({ _id: this._id.toString()},process.env.SECRET);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};


userSchema.statics.findByCredentials = async (username, password) => {
  //these are called on models Sometimes called model methods
  const user = await User.findOne({ username });

  if (!user) throw new Error("Unable to login");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login");

  return user;
};


userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});


userSchema.pre("remove", async function (next) {
  await Task.deleteMany({ owner: this._id });
  next();
});
export const User = new mongoose.model("User", userSchema);
