import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ExpenseModal from './components/ExpenseModal.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AllExpenses from './pages/AllExpenses.jsx';

// Internal Layout wrapper to consume modal state from ExpenseContext
function AppLayout() {
  const { isModalOpen, closeModal, editingExpense } = useExpenses();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body with Sidebar + Page View */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Route View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<AllExpenses />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Add / Edit Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={editingExpense}
      />

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-400">
        SpendWise — Personal Expense Tracker • Built with React, Vite & Tailwind CSS
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ExpenseProvider>
        <AppLayout />
      </ExpenseProvider>
    </BrowserRouter>
  );
}

export default App;
