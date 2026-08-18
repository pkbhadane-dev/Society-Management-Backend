import { User } from "../models/User.model.js";
import { UserType } from "../models/UserType.model.js";
import { apiError } from "../utility/apiError.js";
import { apiResponse } from "../utility/apiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";

export const userRegister = asyncHandler(async (req, res) => {
  const { name, mobile, email, password, userType } = req.body;
  if (!userType || !name || !mobile || !email || !password) {
    throw new apiError(401, "All fields are required");
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new apiError(401, "User already exist");
  }

  const userRole = await UserType.findOne({ userRole: userType });

  console.log("userRole", userRole);
  if (!userRole) {
    throw new apiError(401, "Invalid user type");
  }

  const user = await User.create({
    userType: userRole._id,
    name,
    mobile,
    email,
    password,
  });

  console.log("user", user);

  res
    .status(201)
    .json(new apiResponse(201, `WellCome ${user.userRole.userRole}`, user));
});

export const userLogin = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  if (!password || !email) {
    throw new Error(401, "All fields are required");
  }

  const user = await User.findOne({ email }).populate("userType");
  // console.log("user", user);

  if (!user) {
    console.log("user not found");
    throw new apiError(404, "User not found");
  }

  const verifyPassword = await user.isPasswordCorrect(password);

  if (!verifyPassword) {
    throw new apiError(401, "Incorrect Credentials");
  }

  res
    .status(201)
    .json(new apiResponse(201, `WellCome ${user.userType.userRole}`, user));
});
