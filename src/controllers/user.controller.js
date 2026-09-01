import { User } from "../models/User.model.js";
import { UserType } from "../models/UserType.model.js";
import { apiError } from "../utility/apiError.js";
import { apiResponse } from "../utility/apiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";

const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error.message);
  }
};

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
    .json(new apiResponse(201, user, `WellCome ${userRole.userRole}`));
});

export const userLogin = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  if (!password || !email) {
    throw new Error(401, "All fields are required");
  }

  const user = await User.findOne({ email })
    .populate("userType")
  // console.log("user", user);

  if (!user) {
    console.log("user not found");
    throw new apiError(404, "User not found");
  }

  const verifyPassword = await user.isPasswordCorrect(password);

  if (!verifyPassword) {
    throw new apiError(401, "Incorrect Credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user);

  const accessTokenOptions = {
    httpOnly: true,
    sameSite: "Lax",
    secure: true,
    maxAge: 15 * 60 * 1000,
  };

  const refreshTokenOptions = {
    httpOnly: true,
    sameSite: "Lax",
    secure: true,
    maxAge: 2 * 24 * 60 * 60 * 1000,
  };

  res
    .status(201)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(new apiResponse(201, user, `WellCome ${user.userType.userRole}`));
});
