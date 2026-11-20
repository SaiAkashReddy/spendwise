import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import ExpenseForm from '../components/ExpenseForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import CategoryDonutChart from '../components/CategoryDonutChart.jsx';
import MonthlyBarChart from '../components/MonthlyBarChart.jsx';
import { formatINR, getExpenseMonthKey, formatMonthYear } from '../utils/constants.js';
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

  // Current calendar month key (e.g. "2026-11")
  const currentMonthKey = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, []);

  // 1. Total spending across all recorded expenses
  const totalSpending = summary.totalAmount || 0;

  // 2. Current month's spending
  const currentMonthSpending = useMemo(() => {
    if (summary.currentMonthTotal !== undefined && summary.currentMonthTotal > 0) {
      return summary.currentMonthTotal;
    }
    // Reliable client-side computation from active expenses
    return expenses
      .filter((e) => getExpenseMonthKey(e.date) === currentMonthKey)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [summary.currentMonthTotal, expenses, currentMonthKey]);

  // 3. Number of expenses
  const totalCount = summary.totalExpenses || expenses.length;

  // 4. Highest-spending category
  const topCategory = useMemo(() => {
    if (summary.highestCategory && summary.highestCategoryAmount) {
      return {
        category: summary.highestCategory,
        total: summary.highestCategoryAmount,
      };
    }
    if (summary.categoryTotals && summary.categoryTotals.length > 0) {
      return summary.categoryTotals[0];
    }
    return null;
  }, [summary]);

  // Recent 5 expenses for quick dashboard preview
  const recentExpenses = useMemo(() => {
    return expenses.slice(0, 5);
  }, [expenses]);

  if (loading && expenses.length === 0) {
    return <LoadingSpinner message="Loading your dashboard analytics..." size="lg" />;
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
            Analytics, monthly spending trends, and category distribution.
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

      {/* 4 Summary Cards */}
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
            {formatINR(totalSpending)}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Lifetime recorded expenditure
          </p>
        </div>

        {/* Card 2: Current Month Spending */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {formatMonthYear(currentMonthKey)} Spending
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {formatINR(currentMonthSpending)}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Current calendar month
          </p>
        </div>

        {/* Card 3: Total Expenses Count */}
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
            {totalCount}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Recorded transactions
          </p>
        </div>

        {/* Card 4: Highest-Spending Category */}
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
            {topCategory ? `${formatINR(topCategory.total)} spent` : 'No expenses recorded'}
          </p>
        </div>
      </div>

      {/* Analytics Section: Two Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Donut Chart */}
        <CategoryDonutChart
          categoryTotals={summary.categoryTotals || []}
          totalAmount={totalSpending}
        />

        {/* Monthly Spending Bar Chart */}
        <MonthlyBarChart
          monthlyTotals={summary.monthlyTotals || []}
        />
      </div>

      {/* Bottom Section: Quick Add Form + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Add Expense Form Card */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs h-fit">
          <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <PlusIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Quick Add Expense</h2>
              <p className="text-xs text-slate-500">Record a spending transaction</p>
            </div>
          </div>

          <ExpenseForm
            onSuccess={() => {}}
            embedded={true}
          />
        </div>

        {/* Recent Transactions List */}
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
            emptyDescription="Use the form on the left or click 'New Expense' to record your first transaction."
            viewMode="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
