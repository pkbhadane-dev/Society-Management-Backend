import { Expense } from "../models/Expense.model";
import { apiResponse } from "../utility/apiResponse";

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

  if (!expense) {
    throw new apiError(400, "faild to save expense in database");
  }

  return res
    .status(201)
    .json(apiResponse(201, expense, "Expense successfully save in database"));
});
