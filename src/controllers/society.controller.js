import mongoose, { get, mongo } from "mongoose";
import { Society } from "../models/Society.model.js";
import { User } from "../models/User.model.js";
import { UserType } from "../models/UserType.model.js";
import { apiError } from "../utility/apiError.js";
import { apiResponse } from "../utility/apiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { Flat } from "../models/Flat.model.js";

export const registerSocietyWithAdmin = asyncHandler(async (req, res) => {
  const {
    name,
    registrationNumber,
    address,
    wings,
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

  const calculatedTotalWings = wings.length;
  let calculatedTotalFlats = 0;

  wings.forEach((wing) => {
    calculatedTotalFlats += wing.floor * wing.flatPerFloor;
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [society] = await Society.create(
      [
        {
          name,
          registrationNumber,
          address,
          totalWings: calculatedTotalWings,
          totalFlats: calculatedTotalFlats,
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

    const insertFlat = [];

    wings.forEach((wing) => {
      for (let floor = 1; floor <= wing.floor; floor++) {
        for (let flatNum = 1; flatNum <= wing.flatPerFloor; flatNum++) {
          const flatNo = `${floor}${flatNum < 10 ? "0" + flatNum : flatNum} `;

          insertFlat.push({
            flatNumber: flatNo,
            wing: wing.name,
            flatStatus: "Vacant",
            society: society._id,
          });
        }
      }
    });

    await Flat.insertMany(insertFlat, { session });

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
