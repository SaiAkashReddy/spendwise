import mongoose from 'mongoose';
import { ALLOWED_CATEGORIES, ALLOWED_PAYMENT_METHODS } from '../models/expenseModel.js';

/**
 * Validates that req.params.id is a valid 24-character hexadecimal MongoDB ObjectId.
 */
export const validateExpenseId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID Format',
      message: `"${id}" is not a valid MongoDB ObjectId. An ObjectId must be a 24-character hex string.`,
    });
  }

  next();
};

/**
 * Validates expense payload for POST (creation) and PUT (update).
 */
export const validateExpense = (req, res, next) => {
  const isPost = req.method === 'POST';
  const { amount, category, description, date, paymentMethod } = req.body;
  const errors = [];

  // For PUT, ensure at least one field is provided for update
  if (!isPost) {
    const updatableFields = ['amount', 'category', 'description', 'date', 'paymentMethod'];
    const hasFieldToUpdate = updatableFields.some((field) => req.body[field] !== undefined);

    if (!hasFieldToUpdate) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Request body must include at least one field to update (amount, category, description, date, paymentMethod).',
      });
    }
  }

  // Validate amount
  if (isPost || amount !== undefined) {
    if (amount === undefined || amount === null || amount === '') {
      errors.push('Amount is required');
    } else {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || typeof amount === 'boolean') {
        errors.push('Amount must be a valid number');
      } else if (numAmount <= 0) {
        errors.push('Amount must be greater than zero');
      }
    }
  }

  // Validate category
  if (isPost || category !== undefined) {
    if (!category || typeof category !== 'string' || !category.trim()) {
      errors.push('Category is required');
    } else if (!ALLOWED_CATEGORIES.includes(category.trim())) {
      errors.push(`Invalid category: "${category}". Allowed categories are: ${ALLOWED_CATEGORIES.join(', ')}`);
    }
  }

  // Validate description
  if (isPost || description !== undefined) {
    if (!description || typeof description !== 'string' || !description.trim()) {
      errors.push('Description is required and cannot be empty');
    } else if (description.trim().length > 200) {
      errors.push('Description cannot exceed 200 characters');
    }
  }

  // Validate date
  if (isPost || date !== undefined) {
    if (!date) {
      errors.push('Date is required');
    } else {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        errors.push(`Invalid date format: "${date}". Provide a valid ISO or date string (e.g. YYYY-MM-DD)`);
      }
    }
  }

  // Validate paymentMethod (optional)
  if (paymentMethod !== undefined) {
    if (typeof paymentMethod !== 'string' || !ALLOWED_PAYMENT_METHODS.includes(paymentMethod.trim())) {
      errors.push(`Invalid payment method: "${paymentMethod}". Allowed methods are: ${ALLOWED_PAYMENT_METHODS.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: errors.join('; '),
      errors,
    });
  }

  next();
};
