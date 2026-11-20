import React from 'react';
import { NavLink } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext.jsx';
import { WalletIcon, PlusIcon, DashboardIcon, ListIcon } from './Icons.jsx';

const Navbar = () => {
  const { openAddModal, isDbConnected } = useExpenses();

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Navigation */}
        <div className="flex items-center space-x-8">
          <NavLink to="/dashboard" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
              ₹
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">SpendWise</span>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Personal Tracker
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
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

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3">
          {/* Database Connection Status Pill */}
          <div
            className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isDbConnected === true
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : isDbConnected === false
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title={
              isDbConnected === true
                ? 'MongoDB connected and operational'
                : isDbConnected === false
                ? 'MongoDB disconnected. Verify server and database.'
                : 'Connecting to database...'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDbConnected === true
                  ? 'bg-emerald-500 animate-pulse'
                  : isDbConnected === false
                  ? 'bg-rose-500'
                  : 'bg-slate-400'
              }`}
            />
            <span className="hidden lg:inline">
              {isDbConnected === true
                ? 'Database Connected'
                : isDbConnected === false
                ? 'DB Disconnected'
                : 'Connecting...'}
            </span>
          </div>

          {/* Add Expense Action Button */}
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-emerald-200 transition-all hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center justify-around bg-slate-50/50">
        <NavLink to="/dashboard" className={navLinkClass}>
          <DashboardIcon className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/expenses" className={navLinkClass}>
          <ListIcon className="w-4 h-4" />
          <span>All Expenses</span>
        </NavLink>
      </div>
    </header>
  );
};

export default Navbar;
