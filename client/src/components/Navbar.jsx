import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext.jsx';
import {
  Plus,
  LayoutDashboard,
  ListOrdered,
  Menu,
  X,
  Database,
  Tag,
} from 'lucide-react';
import { CATEGORIES } from '../utils/constants.js';
import CategoryIcon from './CategoryIcon.jsx';

const Navbar = () => {
  const { openAddModal, isDbConnected } = useExpenses();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
      isActive
        ? 'bg-emerald-50 text-emerald-800 shadow-2xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      isActive
        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Desktop Navigation */}
        <div className="flex items-center space-x-8">
          <NavLink to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
              ₹
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight block leading-tight">
                SpendWise
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Personal Finance
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1.5">
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/expenses" className={navLinkClass}>
              <ListOrdered className="w-4 h-4 text-slate-500" />
              <span>All Expenses</span>
            </NavLink>
          </nav>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center space-x-3">
          {/* Database Status Pill */}
          <div
            className={`hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs ${
              isDbConnected === true
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : isDbConnected === false
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
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
                ? 'MongoDB Connected'
                : isDbConnected === false
                ? 'Database Offline'
                : 'Connecting...'}
            </span>
          </div>

          {/* "+ Add Expense" Action Button */}
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-emerald-200 transition-all hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile navigation menu"
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-4 shadow-lg animate-in slide-in-from-top-3 duration-150">
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/expenses"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              <ListOrdered className="w-4 h-4" />
              <span>All Expenses</span>
            </NavLink>
          </nav>

          {/* Database Status in Mobile Menu */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-2">
            <span className="flex items-center space-x-2">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Database Status:</span>
            </span>
            <span
              className={`font-bold ${
                isDbConnected === true
                  ? 'text-emerald-700'
                  : isDbConnected === false
                  ? 'text-rose-600'
                  : 'text-slate-500'
              }`}
            >
              {isDbConnected === true
                ? 'Connected'
                : isDbConnected === false
                ? 'Disconnected'
                : 'Connecting'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
