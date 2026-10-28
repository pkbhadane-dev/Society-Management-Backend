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

export const getExpenseById = asyncHandler(async (req, res) => {
  const { expenseId } = req.body;

  if (!expenseId) {
    throw new apiError(400, "ExpenseId is required");
  }

  const expense = await Expense.findById(expenseId);

  if (!expense) {
    throw new apiError(404, "Expense not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, expense, "Expense fetched successfully"));
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

export const getFinancialSummary = asyncHandler(async (req, res) => {
  const { societyId } = req.query;

  if (!societyId) {
    throw new apiError(400, "Society ID is required");
  }

  const societyObjectId = new mongoose.Types.ObjectId(societyId);

  // Calculate Total Expenses using Aggregation
  const expenseResult = await Expense.aggregate([
    { $match: { society: societyObjectId } },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalExpense =
    expenseResult.length > 0 ? expenseResult[0].totalExpense : 0;
  const expenseCount = expenseResult.length > 0 ? expenseResult[0].count : 0;

  // Calculate Total Income (Paid Maintenance Bills)
  const incomeResult = await MaintenanceBill.aggregate([
    {
      $match: {
        society: societyObjectId,
        status: "Paid",
      },
    },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalIncome = incomeResult.length > 0 ? incomeResult[0].totalIncome : 0;
  const incomeCount = incomeResult.length > 0 ? incomeResult[0].count : 0;

  const netBalance = totalIncome - totalExpense;

  return res.status(200).json(
    new apiResponse(
      200,
      {
        totalIncome,
        totalExpense,
        netBalance,
        incomeCount,
        expenseCount,
      },
      "Financial summary fetched successfully",
    ),
  );
});
