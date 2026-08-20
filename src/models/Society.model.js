import mongoose from "mongoose";

const societyShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    totalWings: {
      type: String,
      required: true,
    },
    totalFlats: {
      type: String,
      required: true,
    },
    adminUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const Society = mongoose.model("Society", societyShema);
