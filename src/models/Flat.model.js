import mongoose from "mongoose";

const flatSchema = new mongoose.Schema(
  {
    flatNumber: {
      type: String,
      required: true,
    },
    wing: {
      type: String,
      required: true,
    },
    flatStatus: {
      type: String,
      required: true,
      enum: {
        values: ["Occupied", "Rented", "Vacant"],
        message: "{VALUE} is not supported",
        default: "Vacant",
      },
    },
    flatType: {
      type: String,
      required: true,
    },
    flatOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    flatTenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pendingUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
    },
  },
  {
    timestamps: true,
  },
);

export const Flat = mongoose.model("Flat", flatSchema);
