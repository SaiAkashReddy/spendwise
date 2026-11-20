import React, { useState, useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import {
  CATEGORIES,
  PAYMENT_METHODS,
  formatINR,
} from '../utils/constants.js';
import {
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  FilterIcon,
  CloseIcon,
  WalletIcon,
  CalendarIcon,
} from '../components/Icons.jsx';

const AllExpenses = () => {
  const {
    expenses,
    loading,
    error,
    fetchExpenses,
    openEditModal,
    openAddModal,
  } = useExpenses();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'highest' | 'lowest'
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Check if any filter is currently applied
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      selectedCategory !== 'all' ||
      selectedPaymentMethod !== 'all' ||
      startDate ||
      endDate ||
      sortBy !== 'newest'
  );

  // Reset all filters to default
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPaymentMethod('all');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
  };

  // Combined Search, Filtering, and Sorting Pipeline
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        // 1. Description Search (Case-Insensitive)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const descriptionMatch = expense.description?.toLowerCase().includes(query);
          if (!descriptionMatch) return false;
        }

        // 2. Category Filter
        if (selectedCategory !== 'all') {
          if (expense.category !== selectedCategory) return false;
        }

        // 3. Payment Method Filter
        if (selectedPaymentMethod !== 'all') {
          if (expense.paymentMethod !== selectedPaymentMethod) return false;
        }

        // 4. Date Range Filter (Using ISO/YYYY-MM-DD comparison)
        const expDateStr =
          typeof expense.date === 'string'
            ? expense.date.slice(0, 10)
            : new Date(expense.date).toISOString().slice(0, 10);

        if (startDate && expDateStr < startDate) {
          return false;
        }
        if (endDate && expDateStr > endDate) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // 5. Sorting
        if (sortBy === 'newest') {
          return new Date(b.date) - new Date(a.date);
        }
        if (sortBy === 'oldest') {
          return new Date(a.date) - new Date(b.date);
        }
        if (sortBy === 'highest') {
          return Number(b.amount) - Number(a.amount);
        }
        if (sortBy === 'lowest') {
          return Number(a.amount) - Number(b.amount);
        }
        return 0;
      });
  }, [
    expenses,
    searchQuery,
    selectedCategory,
    selectedPaymentMethod,
    startDate,
    endDate,
    sortBy,
  ]);

  // Total sum of currently filtered expenses
  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [filteredExpenses]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            All Expenses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter by category/date, sort, and manage all transactions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchExpenses()}
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refresh transactions"
            aria-label="Refresh transactions"
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

      {/* Global Error Banner if any */}
      {error && <ErrorMessage message={error} onRetry={fetchExpenses} />}

      {/* Search, Filter & Sort Controls Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top Controls Row: Search Box + Sort Selector + Toggle Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box (6 columns) */}
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search expenses by description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector (4 columns) */}
          <div className="md:col-span-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="newest">Sort: Date (Newest First)</option>
              <option value="oldest">Sort: Date (Oldest First)</option>
              <option value="highest">Sort: Amount (Highest First)</option>
              <option value="lowest">Sort: Amount (Lowest First)</option>
            </select>
          </div>

          {/* Filter Toggle Button (2 columns) */}
          <div className="md:col-span-2">
            <button
              onClick={() => setIsFilterPanelOpen((prev) => !prev)}
              className={`w-full flex items-center justify-center space-x-2 px-3 py-2.5 border rounded-xl text-sm font-semibold transition-all ${
                isFilterPanelOpen || hasActiveFilters
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FilterIcon className="w-4 h-4" />
              <span>Filters</span>
              {(selectedCategory !== 'all' || selectedPaymentMethod !== 'all' || startDate || endDate) && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters Panel */}
        {isFilterPanelOpen && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-150">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Methods</option>
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Active Filters Pill Bar & Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">
              Showing {filteredExpenses.length} of {expenses.length} expenses
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-extrabold text-slate-900">
              {formatINR(filteredTotal)}
            </span>
          </div>

          {/* Active Filter Chips / Clear All */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5">
              {searchQuery && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-rose-600">
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs">
                  <span>{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-rose-600">
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedPaymentMethod !== 'all' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                  <span>{selectedPaymentMethod}</span>
                  <button onClick={() => setSelectedPaymentMethod('all')} className="hover:text-rose-600">
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(startDate || endDate) && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs">
                  <span>{startDate || 'Start'} → {endDate || 'End'}</span>
                  <button onClick={() => { setStartDate(''); setEndDate(''); }} className="hover:text-rose-600">
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
              {sortBy !== 'newest' && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs">
                  <span>Sorted: {sortBy}</span>
                  <button onClick={() => setSortBy('newest')} className="hover:text-rose-600">
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline ml-1"
              >
                Reset All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Expenses List Display */}
      {loading && expenses.length === 0 ? (
        <LoadingSpinner message="Loading all expenses..." size="lg" />
      ) : filteredExpenses.length === 0 && hasActiveFilters ? (
        <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 sm:p-12 text-center my-6 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <SearchIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching expenses found</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            No expenses matched your current search and filter combination.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <ExpenseList
          expenses={filteredExpenses}
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
