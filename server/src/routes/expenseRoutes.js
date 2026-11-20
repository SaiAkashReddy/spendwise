import express from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} from '../controllers/expenseController.js';
import { validateExpense, validateExpenseId } from '../middleware/validate.js';
import { checkDbConnection } from '../middleware/dbCheck.js';

const router = express.Router();

// Enforce active database connection before attempting operations
router.use(checkDbConnection);

// 1. Summary Route: MUST be registered BEFORE /:id to prevent Express treating 'summary' as an ID parameter
router.get('/summary', getExpenseSummary);

// 2. Collection Routes
router
  .route('/')
  .get(getExpenses)
  .post(validateExpense, createExpense);

// 3. Single Document Routes
router
  .route('/:id')
  .get(validateExpenseId, getExpenseById)
  .put(validateExpenseId, validateExpense, updateExpense)
  .delete(validateExpenseId, deleteExpense);

export default router;
