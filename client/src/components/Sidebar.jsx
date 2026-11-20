import React from 'react';
import { NavLink } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext.jsx';
import { formatINR, CATEGORIES, CATEGORY_COLORS } from '../utils/constants.js';
import { DashboardIcon, ListIcon, PlusIcon, WalletIcon } from './Icons.jsx';

const Sidebar = () => {
  const { summary, openAddModal } = useExpenses();

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between hidden lg:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Navigation */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
            Menu
          </span>
          <nav className="space-y-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              <DashboardIcon className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/expenses" className={navLinkClass}>
              <ListIcon className="w-4 h-4" />
              <span>All Expenses</span>
            </NavLink>
          </nav>
        </div>

        {/* Quick Add Action Button */}
        <div>
          <button
            onClick={openAddModal}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-bold transition-all shadow-2xs"
          >
            <PlusIcon className="w-4 h-4 text-emerald-600" />
            <span>Record Expense</span>
          </button>
        </div>

        {/* Categories Overview */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
            Categories
          </span>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Others;
              return (
                <div
                  key={cat}
                  className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                    <span>{cat}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mini Quick Summary Card in Sidebar Footer */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-sm">
        <div className="flex items-center space-x-2 text-slate-300 text-xs mb-1">
          <WalletIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Total Spent</span>
        </div>
        <div className="text-xl font-extrabold text-white tracking-tight">
          {formatINR(summary.totalAmount)}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {summary.totalExpenses} total transactions recorded
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
