import { Expense } from "../models/Expense.model";
import { apiResponse } from "../utility/apiResponse";
import { asyncHandler } from "../utility/asyncHandler";

export const addExpense = asyncHandler(async (req, res) => {
  const { catagory, title, paidTo, date, society, amount } = req.body;

  if (!catagory || !title || !paidTo || !date || !society || !amount) {
    throw new apiError(400, "All fields are reqiured");
  }

  const expense = await Expense.create({
    catagory,
    title,
    amount,
    paidTo,
    society,
    date: date || Date.now,
  });

  console.log("expense", expense);

  if (!expense) {
    throw new apiError(400, "faild to save expense in database");
  }

  return res
    .status(201)
    .json(
      new apiResponse(201, expense, "Expense successfully save in database"),
    );
});

export const getAllExpenses = asyncHandler(async (req, res) => {
  const { societyId } = req.query;

  if (!societyId) {
    throw new apiError(400, "SocietyId is required");
  }

  const allExpenses = await Expense.find(societyId)
    .populate()
    .sort({ date: -1 });

  console.log("allExpenses", allExpenses);

  if (!allExpenses) {
    throw new apiError(404, "All expenses not found");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, allExpenses, "All expenses fetched successfully"),
    );
});
