import jwt from "jsonwebtoken";
import { User } from "../mongoose/models/User.js";

const auth = async ({ req, res }) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.SECRET);
  const user = await User.findOne({
    _id: decoded._id,
    "tokens.token": token,
  });
  req.user = user;
};
export default auth;
