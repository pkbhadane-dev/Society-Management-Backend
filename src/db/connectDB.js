import mongoose from "mongoose";
// import { asyncHandler } from "../utility/asyncHandler";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("Database connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
