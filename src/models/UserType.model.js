import mongoose from "mongoose";

const userTypeSchema = new mongoose.Schema(
  {
    userRole: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const UserType = mongoose.model("UserType", userTypeSchema);
