import { User } from "../models/User.model.js";
import { UserType } from "../models/UserType.model.js";
import { asyncHandler } from "../utility/asyncHandler.js";

export const userRegister = asyncHandler(async (req, res) => {
  const { name, mobile, email, password, userType } = req.body;
  if (!userType || !name || !mobile || !email) {
    throw new Error(401, "All fields are required");
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new Error(401, "User already exist");
  }

  const userRole = await UserType.findOne({ userRole: userType });
  if (!userRole) {
    console.log("Invalid user type");
  }
  console.log("userRole", userRole);

  const user = await User.create({
    userType: userRoleId._id,
    name,
    mobile,
    email,
    passaword,
  });

  console.log(user);

  res.status(201).json({ user });
});

export const userLogin = asyncHandler(async (req, res) => {
  const { passaword, email } = req.body;
  console.log(email);

  if (!passaword || !email) {
    throw new Error(401, "All fields are required");
  }

  const user = await User.findOne({ email }).populate("userType");
  // console.log("user", user);

  if (!user) {
    console.log("user not found");
    throw new Error(404, "User not found");
  }
  console.log("user" , user);

  res
    .status(201)
    .json({
      success: true,
      message: `WellCome ${user.userType.userRole}`,
      user,
    });
});
