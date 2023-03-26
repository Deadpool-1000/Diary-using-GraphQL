import jwt from "jsonwebtoken";
import { User } from "../mongoose/models/User.js";

const auth = async (token) => {
  const decoded = jwt.verify(token, process.env.SECRET);
  const user = await User.findOne({
    _id: decoded._id,
    "tokens.token": token,
  });
  return user;
};
export default auth;
