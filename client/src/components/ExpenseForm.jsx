import React, { useState, useEffect } from 'react';
import { CATEGORIES, PAYMENT_METHODS, toInputDateFormat } from '../utils/constants.js';
import { useExpenses } from '../context/ExpenseContext.jsx';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ExpenseForm = ({
  initialData = null,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { addExpense, editExpense } = useExpenses();
  const isEditing = Boolean(initialData && initialData._id);

  // Form Fields
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(toInputDateFormat());
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);

  // Validation & UI State
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Prepopulate form when initialData changes (for Edit mode)
  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount !== undefined ? String(initialData.amount) : '');
      setCategory(initialData.category || CATEGORIES[0]);
      setDescription(initialData.description || '');
      setDate(toInputDateFormat(initialData.date));
      setPaymentMethod(initialData.paymentMethod || PAYMENT_METHODS[0]);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setAmount('');
    setCategory(CATEGORIES[0]);
    setDescription('');
    setDate(toInputDateFormat());
    setPaymentMethod(PAYMENT_METHODS[0]);
    setErrors({});
    setServerError(null);
  };

  const validate = () => {
    const newErrors = {};

    // Validate Amount
    if (!amount || String(amount).trim() === '') {
      newErrors.amount = 'Amount is required';
    } else {
      const num = Number(amount);
      if (isNaN(num)) {
        newErrors.amount = 'Amount must be a valid number';
      } else if (num <= 0) {
        newErrors.amount = 'Amount must be greater than zero';
      }
    }

    // Validate Category
    if (!category || !CATEGORIES.includes(category)) {
      newErrors.category = 'Please select a valid category';
    }

    // Validate Description
    if (!description || !description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }

    // Validate Date
    if (!date) {
      newErrors.date = 'Date is required';
    } else if (isNaN(new Date(date).getTime())) {
      newErrors.date = 'Please provide a valid date';
    }

    // Validate Payment Method
    if (!paymentMethod || !PAYMENT_METHODS.includes(paymentMethod)) {
      newErrors.paymentMethod = 'Please select a valid payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      amount: parseFloat(amount),
      category: category.trim(),
      description: description.trim(),
      date: new Date(date).toISOString(),
      paymentMethod,
    };

    try {
      if (isEditing) {
        await editExpense(initialData._id, payload);
        setSuccessMessage('Expense updated successfully!');
      } else {
        await addExpense(payload);
        setSuccessMessage('Expense recorded successfully!');
        resetForm();
      }

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 350);
      }
    } catch (err) {
      const message =
        err.userMessage ||
        err.response?.data?.message ||
        'Failed to save expense. Please check your connection.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Inline Success Notice */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl p-3 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Inline Server Error Notice */}
      {serverError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl p-3 flex items-start space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Amount (INR) <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-2xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
              ₹
            </div>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
              }}
              className={`block w-full pl-8 pr-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.amount
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-200 focus:ring-emerald-500 focus:border-transparent'
              }`}
            />
          </div>
          {errors.amount && (
            <p id="amount-error" className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.amount}</span>
            </p>
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            id="category"
            value={category}
            aria-invalid={Boolean(errors.category)}
            onChange={(e) => {
              setCategory(e.target.value);
              if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
            }}
            className={`block w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.category
                ? 'border-rose-300 focus:ring-rose-500'
                : 'border-slate-200 focus:ring-emerald-500 focus:border-transparent'
            }`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.category}</span>
            </p>
          )}
        </div>
      </div>

      {/* Description Field */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Description <span className="text-rose-500">*</span>
          </label>
          <span className={`text-[10px] font-semibold ${description.length >= 190 ? 'text-rose-500' : 'text-slate-400'}`}>
            {description.length}/200
          </span>
        </div>
        <input
          type="text"
          id="description"
          maxLength={200}
          placeholder="e.g. Flight to Mumbai, Team Lunch, Electricity Bill"
          value={description}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'desc-error' : undefined}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
          }}
          className={`block w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
            errors.description
              ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
              : 'border-slate-200 focus:ring-emerald-500 focus:border-transparent'
          }`}
        />
        {errors.description && (
          <p id="desc-error" className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errors.description}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date Field */}
        <div>
          <label htmlFor="date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            value={date}
            aria-invalid={Boolean(errors.date)}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors((prev) => ({ ...prev, date: null }));
            }}
            className={`block w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.date
                ? 'border-rose-300 focus:ring-rose-500'
                : 'border-slate-200 focus:ring-emerald-500 focus:border-transparent'
            }`}
          />
          {errors.date && (
            <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.date}</span>
            </p>
          )}
        </div>

        {/* Payment Method Field */}
        <div>
          <label htmlFor="paymentMethod" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Payment Method
          </label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          >
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-2 flex items-center justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-emerald-200 transition-all hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{isEditing ? 'Updating...' : 'Recording...'}</span>
            </>
          ) : (
            <span>{isEditing ? 'Update Expense' : 'Save Expense'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
