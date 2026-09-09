import { Flat } from "../models/Flat.model.js";
import { apiError } from "../utility/apiError.js";
import { apiResponse } from "../utility/apiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { User } from "../models/User.model.js";

export const flatRegisterRequest = asyncHandler(async (req, res) => {
  const { flatNumber, wing, flatType, society } = req.body;
  const userId = user._id;

  if (!flatNumber || !wing || !society || !flatType) {
    throw new apiError(
      400,
      "Flat number, Society, Wing, Flat type are required",
    );
  }

  const flat = await Flat.findOne({
    society,
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
