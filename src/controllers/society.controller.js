import mongoose, { get, mongo } from "mongoose";
import { Society } from "../models/Society.model";
import { User } from "../models/User.model";
import { UserType } from "../models/UserType.model";
import { apiError } from "../utility/apiError";
import { apiResponse } from "../utility/apiResponse";
import { asyncHandler } from "../utility/asyncHandler";

export const registerSocietyWithAdmin = asyncHandler(async (req, res) => {
  const {
    name,
    registrationNumber,
    address,
    totalWings,
    totalFlats,
    adminName,
    adminEmail,
    adminMobile,
    adminPassword,
  } = req.body;

  /////////////////////
  // validation pending
  /////////////////////

  const isSocietyExist = await Society.findOne({ registrationNumber });

  if (isSocietyExist) {
    throw new apiError(400, "Society already exist");
  }

  const isAdminExist = await User.findOne({
    $or: [{ email: adminEmail }, { mobile: adminMobile }],
  });

  if (isAdminExist) {
    throw new apiError(400, "Admin already exist");
  }

  const getSecretary = await UserType.findOne({ userRole: "Secretary" });

  if (!getSecretary) {
    throw new apiError(404, "Secretary role not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [society] = await Society.create(
      [
        {
          name,
          registrationNumber,
          address,
          totalWings,
          totalFlats,
        },
      ],
      { session },
    );

    const [admin] = await User.create(
      [
        {
          name: adminName,
          mobile: adminMobile,
          email: adminEmail,
          password: adminPassword,
          userType: getSecretary._id,
          society: society._id,
        },
      ],
      { session },
    );

    society.adminUser = admin._id;
    await society.save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json(
        new apiResponse(
          200,
          society,
          "Society and Admin registered successfully",
        ),
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
});
