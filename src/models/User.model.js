import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passaword: {
      type: String,
      required: true,
    },
    userType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserType",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
