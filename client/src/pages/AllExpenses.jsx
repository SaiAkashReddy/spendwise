import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { formatINR } from '../utils/constants.js';
import { PlusIcon, RefreshIcon, WalletIcon } from '../components/Icons.jsx';

const AllExpenses = () => {
  const {
    expenses,
    loading,
    error,
    fetchExpenses,
    openEditModal,
    openAddModal,
  } = useExpenses();

  const [sortOrder, setSortOrder] = useState('desc');

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortOrder(newSort);
    fetchExpenses(newSort);
  };

  // Calculate sum of displayed expenses
  const displayedTotal = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            All Expenses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View, inspect, edit, or delete all of your recorded expenses.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchExpenses(sortOrder)}
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refresh list"
            aria-label="Refresh list"
          >
            <RefreshIcon className="w-4 h-4" />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-emerald-200 transition-all hover:shadow"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && <ErrorMessage message={error} onRetry={() => fetchExpenses(sortOrder)} />}

      {/* Controls Bar: Total Summary Badge + Sort Filter */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Count and Total Information */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <WalletIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Listed
            </div>
            <div className="text-lg font-extrabold text-slate-900 tracking-tight">
              {formatINR(displayedTotal)}{' '}
              <span className="text-xs font-normal text-slate-500 ml-1">
                ({expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'})
              </span>
            </div>
          </div>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sort-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortOrder}
            onChange={handleSortChange}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="desc">Date (Newest First)</option>
            <option value="asc">Date (Oldest First)</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {loading && expenses.length === 0 ? (
        <LoadingSpinner message="Fetching all expenses..." size="lg" />
      ) : (
        <ExpenseList
          expenses={expenses}
          onEdit={openEditModal}
          onAddClick={openAddModal}
          emptyTitle="No expenses found"
          emptyDescription="You have no recorded expenses yet. Click 'Add Expense' to record your first transaction."
          viewMode="auto"
        />
      )}
    </div>
  );
};

export default AllExpenses;
