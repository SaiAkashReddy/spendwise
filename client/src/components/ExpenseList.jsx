import React, { useState } from 'react';
import ExpenseCard from './ExpenseCard.jsx';
import ExpenseTable from './ExpenseTable.jsx';
import EmptyState from './EmptyState.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useExpenses } from '../context/ExpenseContext.jsx';

const ExpenseList = ({
  expenses = [],
  onEdit,
  emptyTitle = 'No expenses found',
  emptyDescription = 'You have not added any expenses yet.',
  onAddClick,
  viewMode = 'auto', // 'table' | 'cards' | 'auto'
}) => {
  const { removeExpense } = useExpenses();
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  if (!expenses || expenses.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        onAction={onAddClick}
        actionText="Add New Expense"
      />
    );
  }

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await removeExpense(expenseToDelete._id);
      setExpenseToDelete(null);
    } catch (err) {
      setDeleteError(err.userMessage || 'Failed to delete expense');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Delete Failure Alert */}
      {deleteError && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl p-3 flex justify-between items-center">
          <span>{deleteError}</span>
          <button
            onClick={() => setDeleteError(null)}
            className="text-xs text-rose-600 font-semibold underline hover:text-rose-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Desktop View: Table */}
      {(viewMode === 'table' || viewMode === 'auto') && (
        <div className="hidden md:block">
          <ExpenseTable
            expenses={expenses}
            onEdit={onEdit}
            onDelete={(exp) => setExpenseToDelete(exp)}
          />
        </div>
      )}

      {/* Mobile View: Cards */}
      {(viewMode === 'cards' || viewMode === 'auto') && (
        <div className={`space-y-3 ${viewMode === 'auto' ? 'md:hidden' : ''}`}>
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense._id}
              expense={expense}
              onEdit={onEdit}
              onDelete={(exp) => setExpenseToDelete(exp)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog for Deletion */}
      <ConfirmDialog
        isOpen={Boolean(expenseToDelete)}
        title="Delete Expense"
        message={
          expenseToDelete
            ? `Are you sure you want to delete "${expenseToDelete.description}" of amount ₹${expenseToDelete.amount}? This action cannot be undone.`
            : ''
        }
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!isDeleting) setExpenseToDelete(null);
        }}
      />
    </div>
  );
};

export default ExpenseList;
