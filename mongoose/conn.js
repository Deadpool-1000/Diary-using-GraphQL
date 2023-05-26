import mongoose from "mongoose";
console.log(process.env);
mongoose.connect(process.env.APOLLO_MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true });