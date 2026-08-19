import jwt from "jsonwebtoken";
import { apiError } from "../utility/apiError";
import { User } from "../models/User.model";
export const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers["authorization"].split(" ")[1];

    const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!verifyToken) {
      throw new apiError(401, "Token not verified");
    }

    const user = await User.findById(verifyToken._id).populate("userType");

    console.log("user", user);

    if (!user) {
      throw new apiError(404, "User not found");
    }

    return (req.user = user);
    next();
  } catch (error) {
    console.log(error.meessage);
    next();
  }
};
