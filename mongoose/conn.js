import mongoose from "mongoose";
export default function connector(uri){
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}