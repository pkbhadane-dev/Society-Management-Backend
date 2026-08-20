import mongoose from "mongoose";

const maintenanceBillSchema = new mongoose.Schema(
  {
    flat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    year: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    charge: {
      type: Number,
      required: true,
    },
    penalty: {
      type: Number,
      required: true,
    },
    totalAmpount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: [Paid, Unpaid],
        message: "{VALUE} is not supported",
        default: "Unpaid",
      },
    },
  },
  {
    timestamps: true,
  },
);

export const MaintenanceBill = mongoose.model(
  "MaintenanceBill",
  maintenanceBillSchema,
);
