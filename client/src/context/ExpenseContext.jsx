import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import expenseService from '../services/expenseService.js';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalExpenses: 0,
    categoryTotals: [],
    monthlyTotals: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDbConnected, setIsDbConnected] = useState(null);

  // Modal state for Add/Edit Expense
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Fetch summary and expenses from backend
  const fetchExpenses = useCallback(async (sort = 'desc') => {
    setLoading(true);
    setError(null);
    try {
      // Fetch expenses and summary concurrently
      const [expensesRes, summaryRes] = await Promise.allSettled([
        expenseService.getExpenses(sort),
        expenseService.getSummary(),
      ]);

      if (expensesRes.status === 'fulfilled') {
        setExpenses(expensesRes.value.data || []);
        setIsDbConnected(true);
      } else {
        const errMsg = expensesRes.reason?.userMessage || 'Failed to fetch expenses';
        setError(errMsg);
        if (expensesRes.reason?.response?.status === 503) {
          setIsDbConnected(false);
        }
      }

      if (summaryRes.status === 'fulfilled') {
        setSummary(summaryRes.value.data || {
          totalAmount: 0,
          totalExpenses: 0,
          categoryTotals: [],
          monthlyTotals: [],
        });
      }
    } catch (err) {
      setError(err.userMessage || 'Failed to communicate with server');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Create Expense
  const addExpense = async (expenseData) => {
    try {
      const result = await expenseService.createExpense(expenseData);
      const newExpense = result.data;

      // Update state immediately: prepend new expense
      setExpenses((prev) => [newExpense, ...prev]);

      // Refresh summary in background to ensure accurate totals
      expenseService.getSummary().then((res) => {
        if (res.data) setSummary(res.data);
      }).catch(() => {});

      return newExpense;
    } catch (err) {
      throw err;
    }
  };

  // Update Expense
  const editExpense = async (id, updatedData) => {
    try {
      const result = await expenseService.updateExpense(id, updatedData);
      const updatedExpense = result.data;

      // Update in local state in-place
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === id ? updatedExpense : exp))
      );

      // Refresh summary
      expenseService.getSummary().then((res) => {
        if (res.data) setSummary(res.data);
      }).catch(() => {});

      return updatedExpense;
    } catch (err) {
      throw err;
    }
  };

  // Delete Expense
  const removeExpense = async (id) => {
    try {
      await expenseService.deleteExpense(id);

      // Remove from state immediately
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));

      // Refresh summary
      expenseService.getSummary().then((res) => {
        if (res.data) setSummary(res.data);
      }).catch(() => {});
    } catch (err) {
      throw err;
    }
  };

  // Modal open helpers
  const openAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingExpense(null);
    setIsModalOpen(false);
  };

  const value = useMemo(
    () => ({
      expenses,
      summary,
      loading,
      error,
      isDbConnected,
      isModalOpen,
      editingExpense,
      fetchExpenses,
      addExpense,
      editExpense,
      removeExpense,
      openAddModal,
      openEditModal,
      closeModal,
    }),
    [
      expenses,
      summary,
      loading,
      error,
      isDbConnected,
      isModalOpen,
      editingExpense,
      fetchExpenses,
    ]
  );

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export default ExpenseContext;
