import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
      enum: {
        values: [
          "Developer",
          "Chairman",
          "Secretary",
          "Treasurer",
          "Owner",
          "Member",
        ],
        message: "{VALUE} is not supported",
      },
    },
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
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
