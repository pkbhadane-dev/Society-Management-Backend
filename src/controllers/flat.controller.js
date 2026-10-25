import { Flat } from "../models/Flat.model.js";
import { apiError } from "../utility/apiError.js";
import { apiResponse } from "../utility/apiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { User } from "../models/User.model.js";
import mongoose from "mongoose";

export const flatRegisterRequest = asyncHandler(async (req, res) => {
  const { flatNumber, wing, flatType, society } = req.body;
  console.log("society", req.body);

  const userId = req.user._id;

  if (!flatNumber || !wing || !society || !flatType) {
    throw new apiError(
      400,
      "Flat number, Society, Wing, Flat type are required",
    );
  }

  const flat = await Flat.findOne({
    society: society, // society Id
    wing,
    flatNumber,
  });

  if (!flat) {
    throw new apiError(404, "Flat not found in this society");
  }

  if (flat.flatStatus !== "Vacant") {
    throw new apiError(401, "This Flat is already occupied");
  }

  flat.pendingUser = userId;
  await flat.save();

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      society: society,
      userStatus: "Pending",
    },
    {
      new: true,
    },
  );

  res.status(201).json(
    new apiResponse(
      201,
      {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          status: updatedUser.userStatus,
        },
        flat: {
          id: flat._id,
          wing: flat.wing,
          flatNumber: flat.flatNumber,
        },
      },
      "flat registraion submitted to secretary",
    ),
  );
});

export const approveFlatRequest = asyncHandler(async (req, res) => {
  const { flatId, action } = req.body;

  if (!flatId || !action) {
    throw new apiError(400, "FlatId and Action are required");
  }

  const flat = await Flat.findById(flatId).populate("pendingUser");

  if (!flat) {
    throw new apiError(404, "Flat not found");
  }

  const user = flat.pendingUser;

  if (!user) {
    throw new apiError(404, "Pending User are not found");
  }

  if (action === "reject") {
    flat.pendingUser = null;
    await flat.save();

    user.userStatus = "Rejected";
    await user.save();

    return res
      .status(200)
      .json(new apiResponse(200, null, "Flat requsset Rejected"));
  }

  // Approval flow with transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    user.userStatus = "Approved";
    await user.save({ session });

    await user.populate("userType");

    if (user.userType.userRole === "Tenant") {
      flat.flatStatus = "Rented";
      flat.flatTenant = user._id;

      await flat.save({ session });
    } else {
      flat.flatStatus = "Occupied";
      flat.flatOwner = user._id;

      await flat.save({ session });
    }

    flat.pendingUser = null;
    await flat.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new apiResponse(200, flat, "Flat registration request is aproved"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new apiError(error.statusCode || 500, error.message);
  }
});
