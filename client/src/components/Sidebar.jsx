import React from 'react';
import { NavLink } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext.jsx';
import { formatINR, CATEGORIES } from '../utils/constants.js';
import CategoryIcon from './CategoryIcon.jsx';
import { LayoutDashboard, ListOrdered, Plus, Wallet } from 'lucide-react';

const Sidebar = () => {
  const { summary, openAddModal } = useExpenses();

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
      isActive
        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between hidden lg:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
            Navigation
          </span>
          <nav className="space-y-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/expenses" className={navLinkClass}>
              <ListOrdered className="w-4 h-4" />
              <span>All Expenses</span>
            </NavLink>
          </nav>
        </div>

        {/* Quick Add Expense Action */}
        <div>
          <button
            onClick={openAddModal}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100/90 active:scale-98 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-bold transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Plus className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>Record Expense</span>
          </button>
        </div>

        {/* Category Shortcuts */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
            Categories
          </span>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                className="flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <CategoryIcon category={cat} size="sm" />
                  <span>{cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Gradient Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-md border border-slate-700/50">
        <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1.5">
          <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">Total Outflow</span>
        </div>
        <div className="text-xl font-black text-white tracking-tight">
          {formatINR(summary.totalAmount)}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {summary.totalExpenses} transactions logged
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
