import React from 'react';
import { WalletIcon, PlusIcon } from './Icons.jsx';

const EmptyState = ({
  title = 'No expenses found',
  description = 'You have not added any expenses yet. Start tracking your spending by adding your first expense.',
  onAction,
  actionText = 'Add Expense',
}) => {
  return (
    <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 sm:p-12 text-center my-6 shadow-sm">
      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
        <WalletIcon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-emerald-200 transition-all hover:shadow"
        >
          <PlusIcon className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
