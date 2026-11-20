import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import ExpenseForm from '../components/ExpenseForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { formatINR, CATEGORY_COLORS } from '../utils/constants.js';
import {
  WalletIcon,
  TrendingUpIcon,
  CalendarIcon,
  TagIcon,
  PlusIcon,
  ListIcon,
} from '../components/Icons.jsx';

const Dashboard = () => {
  const {
    expenses,
    summary,
    loading,
    error,
    fetchExpenses,
    openEditModal,
    openAddModal,
  } = useExpenses();

  // Latest 5 expenses for quick dashboard preview
  const recentExpenses = useMemo(() => {
    return expenses.slice(0, 5);
  }, [expenses]);

  // Top category computation
  const topCategory = useMemo(() => {
    if (!summary.categoryTotals || summary.categoryTotals.length === 0) return null;
    return summary.categoryTotals[0]; // Already sorted descending by total in backend
  }, [summary]);

  // Average expense amount computation
  const averageExpense = useMemo(() => {
    if (!summary.totalExpenses || summary.totalExpenses === 0) return 0;
    return summary.totalAmount / summary.totalExpenses;
  }, [summary]);

  if (loading && expenses.length === 0) {
    return <LoadingSpinner message="Loading your dashboard..." size="lg" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your personal spending, recent transactions, and category breakdowns.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-emerald-200 transition-all hover:shadow self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Expense</span>
        </button>
      </div>

      {/* Global Error Banner if any */}
      {error && <ErrorMessage message={error} onRetry={fetchExpenses} />}

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Spending */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Spending
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <WalletIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {formatINR(summary.totalAmount)}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Across {summary.totalExpenses} total transactions
          </p>
        </div>

        {/* Card 2: Total Expenses Count */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Entries
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ListIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {summary.totalExpenses}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Logged expense transactions
          </p>
        </div>

        {/* Card 3: Top Category */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Top Category
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TagIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">
            {topCategory ? topCategory.category : '—'}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            {topCategory ? formatINR(topCategory.total) : 'No expenses recorded'}
          </p>
        </div>

        {/* Card 4: Average Expense */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Average Expense
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUpIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {formatINR(averageExpense)}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Average per transaction
          </p>
        </div>
      </div>

      {/* Main Grid: Add Expense Card + Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Add Expense Form Card (Left Column) */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs h-fit">
          <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <PlusIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Quick Add Expense</h2>
              <p className="text-xs text-slate-500">Record an expense immediately</p>
            </div>
          </div>

          <ExpenseForm
            onSuccess={() => {}}
            embedded={true}
          />
        </div>

        {/* Recent Expenses List (Right Column - 2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
              <p className="text-xs text-slate-500">Latest recorded expenses</p>
            </div>
            {expenses.length > 0 && (
              <Link
                to="/expenses"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center space-x-1"
              >
                <span>View All ({expenses.length})</span>
                <span>&rarr;</span>
              </Link>
            )}
          </div>

          <ExpenseList
            expenses={recentExpenses}
            onEdit={openEditModal}
            onAddClick={openAddModal}
            emptyTitle="No recent transactions"
            emptyDescription="Use the form on the left to record your first expense transaction."
            viewMode="auto"
          />
        </div>
      </div>

      {/* Category Breakdown Section */}
      {summary.categoryTotals && summary.categoryTotals.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Spending by Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {summary.categoryTotals.map((item) => {
              const color = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Others;
              const percentage = summary.totalAmount > 0
                ? Math.round((item.total / summary.totalAmount) * 100)
                : 0;

              return (
                <div
                  key={item.category}
                  className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color.bg} ${color.text} ${color.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                      <span>{item.category}</span>
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {percentage}%
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="text-lg font-bold text-slate-900">
                      {formatINR(item.total)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color.dot}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
