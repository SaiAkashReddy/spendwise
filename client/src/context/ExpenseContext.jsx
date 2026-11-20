import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import expenseService from '../services/expenseService.js';
import Toast from '../components/Toast.jsx';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalExpenses: 0,
    currentMonthTotal: 0,
    highestCategory: null,
    highestCategoryAmount: 0,
    categoryTotals: [],
    monthlyTotals: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDbConnected, setIsDbConnected] = useState(null);

  // Modal state for Add/Edit Expense
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });

    // Auto-dismiss after 3.5 seconds
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3500);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch summary and expenses from backend
  const fetchExpenses = useCallback(async (sort = 'desc') => {
    setLoading(true);
    setError(null);
    try {
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
        setSummary(
          summaryRes.value.data || {
            totalAmount: 0,
            totalExpenses: 0,
            currentMonthTotal: 0,
            highestCategory: null,
            highestCategoryAmount: 0,
            categoryTotals: [],
            monthlyTotals: [],
          }
        );
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

  // Create Expense with Toast
  const addExpense = async (expenseData) => {
    try {
      const result = await expenseService.createExpense(expenseData);
      const newExpense = result.data;

      // Optimistic update: prepend new expense
      setExpenses((prev) => [newExpense, ...prev]);

      // Refresh summary
      expenseService
        .getSummary()
        .then((res) => {
          if (res.data) setSummary(res.data);
        })
        .catch(() => {});

      showToast('Expense created successfully!', 'success');
      return newExpense;
    } catch (err) {
      showToast(err.userMessage || 'Failed to create expense', 'error');
      throw err;
    }
  };

  // Update Expense with Toast
  const editExpense = async (id, updatedData) => {
    try {
      const result = await expenseService.updateExpense(id, updatedData);
      const updatedExpense = result.data;

      // In-place state update
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === id ? updatedExpense : exp))
      );

      // Refresh summary
      expenseService
        .getSummary()
        .then((res) => {
          if (res.data) setSummary(res.data);
        })
        .catch(() => {});

      showToast('Expense updated successfully!', 'success');
      return updatedExpense;
    } catch (err) {
      showToast(err.userMessage || 'Failed to update expense', 'error');
      throw err;
    }
  };

  // Delete Expense with Toast
  const removeExpense = async (id) => {
    try {
      await expenseService.deleteExpense(id);

      // Remove from state immediately
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));

      // Refresh summary
      expenseService
        .getSummary()
        .then((res) => {
          if (res.data) setSummary(res.data);
        })
        .catch(() => {});

      showToast('Expense deleted successfully!', 'success');
    } catch (err) {
      showToast(err.userMessage || 'Failed to delete expense', 'error');
      throw err;
    }
  };

  // Modal open/close helpers
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
      toast,
      showToast,
      hideToast,
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
      toast,
      showToast,
      hideToast,
      fetchExpenses,
    ]
  );

  return (
    <ExpenseContext.Provider value={value}>
      {children}
      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />
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
