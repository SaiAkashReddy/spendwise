import Expense from '../models/expenseModel.js';

/**
 * @desc   Get all expenses (sorted by date, newest first by default)
 * @route  GET /api/expenses
 * @access Public
 */
export const getExpenses = async (req, res, next) => {
  try {
    const sortDirection = req.query.sort === 'asc' || req.query.sort === 'oldest' ? 1 : -1;

    // Sort by date according to preference, with createdAt as secondary tiebreaker
    const expenses = await Expense.find().sort({ date: sortDirection, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get aggregate summary of expenses
 * @route  GET /api/expenses/summary
 * @access Public
 */
export const getExpenseSummary = async (req, res, next) => {
  try {
    // 1. Overall total and count
    const overallStats = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalExpenses: { $sum: 1 },
        },
      },
    ]);

    // 2. Category-wise totals
    const categoryTotals = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: { $round: ['$total', 2] },
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    // 3. Monthly spending totals (formatted as YYYY-MM)
    const monthlyTotals = await Expense.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          total: { $round: ['$total', 2] },
          count: 1,
        },
      },
      { $sort: { month: -1 } },
    ]);

    const totalAmount = overallStats.length > 0 ? Number(overallStats[0].totalAmount.toFixed(2)) : 0;
    const totalExpenses = overallStats.length > 0 ? overallStats[0].totalExpenses : 0;

    res.status(200).json({
      success: true,
      data: {
        totalAmount,
        totalExpenses,
        categoryTotals,
        monthlyTotals,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single expense by ID
 * @route  GET /api/expenses/:id
 * @access Public
 */
export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Expense with ID ${req.params.id} was not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create a new expense
 * @route  POST /api/expenses
 * @access Public
 */
export const createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date, paymentMethod } = req.body;

    const expense = await Expense.create({
      amount: Number(amount),
      category: category.trim(),
      description: description.trim(),
      date: new Date(date),
      paymentMethod: paymentMethod ? paymentMethod.trim() : 'Cash',
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update an existing expense
 * @route  PUT /api/expenses/:id
 * @access Public
 */
export const updateExpense = async (req, res, next) => {
  try {
    const updateData = {};

    if (req.body.amount !== undefined) updateData.amount = Number(req.body.amount);
    if (req.body.category !== undefined) updateData.category = req.body.category.trim();
    if (req.body.description !== undefined) updateData.description = req.body.description.trim();
    if (req.body.date !== undefined) updateData.date = new Date(req.body.date);
    if (req.body.paymentMethod !== undefined) updateData.paymentMethod = req.body.paymentMethod.trim();

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // Return modified document
        runValidators: true, // Enforce Mongoose schema validation on update
      }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Expense with ID ${req.params.id} was not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete an expense
 * @route  DELETE /api/expenses/:id
 * @access Public
 */
export const deleteExpense = async (req, res, next) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Expense with ID ${req.params.id} was not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: {
        id: req.params.id,
        description: deletedExpense.description,
        amount: deletedExpense.amount,
      },
    });
  } catch (error) {
    next(error);
  }
};
