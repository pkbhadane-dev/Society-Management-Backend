import { Flat } from "../models/Flat.model";
import { MaintenanceBill } from "../models/MaintenanceBill.model.js";
import { apiError } from "../utility/apiError";
import { apiResponse } from "../utility/apiResponse";
import { asyncHandler } from "../utility/asyncHandler";

export const generateMaintenanceBill = asyncHandler(async (req, res) => {
  const { year, month, charge, penalty, dueDate } = req.body;

  const occupiedFlats = await Flat.find({ flatStatus: { $ne: "Vacant" } });

  if (occupiedFlats.length === 0) {
    throw new apiError(404, "Occupied flats are not found");
  }

  const maintenanceBill = occupiedFlats.map((flat) => {
    const totalCharge = Number(charge) + Number(penalty || 0);
    const user = flat.flatOwner || flat.flatTenant;

    return {
      year,
      month,
      totalAmpount: totalCharge,
      charge,
      penalty,
      dueDate,
      flat: flat._id,
      user: user,
    };
  });

  await MaintenanceBill.insertMany(maintenanceBill);

  res
    .status(201)
    .json(
      new apiResponse(
        200,
        null,
        `Bills successfully generated for ${maintenanceBill.length} flats.`,
      ),
    );
});

export const getMaintenanceBill = asyncHandler(async (req, res) => {
  const user = req.user;

  const bill = await MaintenanceBill.find({ user: user._id }).populate("flat");

  res
    .status(201)
    .json(new apiResponse(200, bill, "Maintenance Bill Successfully Fetched"));
});
