import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    catagory: {
      type: String,
      enum: ["Maintenance", "Electricity", "Water", "Event", "Salary", "Other"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    paidTo: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
      enum: ["Upi", "Cash", "Check"],
    },
  },
  {
    timestamps: true,
  },
);

export const Expense = mongoose.model("Expense", expenseSchema);
