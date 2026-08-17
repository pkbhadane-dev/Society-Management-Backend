import { connectDB } from "../db/connectDB.js";
import { UserType } from "../models/UserType.model";

export const insertRole = async () => {
  try {
    await connectDB();
    await UserType.deleteMany({});

    await UserType.insertMany([
      { userRole: "Developer", description: "Handle Software" },
      { userRole: "Chairman", description: "Society Chairman" },
      { userRole: "Secretary", description: "Society Management Head" },
      { userRole: "Treasurer", description: "Society Money Manager" },
      { userRole: "Member", description: "Society Member" },
      { userRole: "Owner", description: "Society Head" },
    ]);
    console.log("Role Insert Successfully");

    process.exit();
  } catch (error) {
    console.log("Role Insert Error", error.message);

    process.exit(1);
  }
};
