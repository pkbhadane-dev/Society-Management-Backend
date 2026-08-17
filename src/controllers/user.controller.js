import { User } from "../models/User.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";

export const userRegister = asyncHandler(async (req, res) => {
  const { userType, name, mobile, email } = req.body;
  if (!userType || !name || !mobile || !email) {
    throw new Error(401, "All fields are required");
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new Error(401, "User already exist");
  }

  const user = await User.create({ userType, name, mobile, email });

  res.status(201).json({ user });
});

export const userLogin = asyncHandler(async (req, res) => {
  const { name, mobile, email } = req.body;
  console.log(email);

  if (!mobile || !email) {
    throw new Error(401, "All fields are required");
  }

  const user = await User.findOne({ email });
  console.log("user", user);

  if (!user) {
    console.log("user not found");
    throw new Error(404, "User not found");
  }
  // console.log("user" , user);

  res.status(201).json({ user });
});
