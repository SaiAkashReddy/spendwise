import React, { useEffect } from 'react';
import ExpenseForm from './ExpenseForm.jsx';
import { X, Plus, Edit3 } from 'lucide-react';

const ExpenseModal = ({
  isOpen,
  onClose,
  initialData = null,
  onSuccess,
}) => {
  const isEditing = Boolean(initialData && initialData._id);

  // Prevent background scrolling and handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 transform transition-all animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                isEditing
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {isEditing ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 id="modal-headline" className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {isEditing ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Update the details of your recorded spending'
                  : 'Record a new spending transaction'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Embedded Expense Form */}
        <ExpenseForm
          initialData={initialData}
          onSuccess={() => {
            if (onSuccess) onSuccess();
            onClose();
          }}
          onCancel={onClose}
          embedded={true}
        />
      </div>
    </div>
  );
};

export default ExpenseModal;
