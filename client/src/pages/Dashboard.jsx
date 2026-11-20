import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import ExpenseForm from '../components/ExpenseForm.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import CategoryDonutChart from '../components/CategoryDonutChart.jsx';
import MonthlyBarChart from '../components/MonthlyBarChart.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';
import {
  SkeletonSummaryCards,
  SkeletonCharts,
  SkeletonCardList,
} from '../components/SkeletonLoader.jsx';
import {
  formatINR,
  getExpenseMonthKey,
  formatMonthYear,
  CATEGORY_COLORS,
} from '../utils/constants.js';
import {
  Wallet,
  Calendar,
  ListOrdered,
  Tag,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

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

  // Recent 5 expenses
  const recentExpenses = useMemo(() => {
    return expenses.slice(0, 5);
  }, [expenses]);

  // Render skeleton loaders when initial data is loading
  if (loading && expenses.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse" />
        <SkeletonSummaryCards />
        <SkeletonCharts />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="lg:col-span-2">
            <SkeletonCardList count={4} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-time analytics, monthly expenditure trends, and category distribution.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-emerald-200 transition-all hover:shadow self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Expense</span>
        </button>
      </div>

      {/* Error Notice */}
      {error && <ErrorMessage message={error} onRetry={fetchExpenses} />}

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Spending */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Spending
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <Wallet className="w-5 h-5" />
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
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {formatMonthYear(currentMonthKey)} Spending
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
              <Calendar className="w-5 h-5" />
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
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Entries
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <ListOrdered className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {totalCount}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Recorded transactions
          </p>
        </div>

        {/* Card 4: Highest Category */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Top Category
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Tag className="w-5 h-5" />
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

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDonutChart
          categoryTotals={summary.categoryTotals || []}
          totalAmount={totalSpending}
        />
        <MonthlyBarChart
          monthlyTotals={summary.monthlyTotals || []}
        />
      </div>

      {/* Quick Add Expense + Recent Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Add Expense Card */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs h-fit hover:border-slate-300 transition-all duration-200">
          <div className="flex items-center space-x-3 mb-5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Plus className="w-4 h-4 stroke-[2.5]" />
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
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Transactions</h2>
              <p className="text-xs text-slate-500">Latest recorded spending entries</p>
            </div>
            {expenses.length > 0 && (
              <Link
                to="/expenses"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center space-x-1"
              >
                <span>View All ({expenses.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
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

      {/* Category Breakdown Cards Grid */}
      {summary.categoryTotals && summary.categoryTotals.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Category Spending Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Detailed view across expenditure categories
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {summary.categoryTotals.map((item) => {
              const color = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Others;
              const percentage =
                totalSpending > 0
                  ? Math.round((item.total / totalSpending) * 100)
                  : 0;

              return (
                <div
                  key={item.category}
                  className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-50 hover:shadow-xs transition-all duration-150"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <CategoryIcon category={item.category} size="sm" />
                      <span className="text-xs font-bold text-slate-800">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      {percentage}%
                    </span>
                  </div>

                  <div>
                    <div className="text-lg font-black text-slate-900 tracking-tight">
                      {formatINR(item.total)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
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
