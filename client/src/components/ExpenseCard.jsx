import React from 'react';
import { formatINR, formatDate, CATEGORY_COLORS, PAYMENT_METHOD_BADGES } from '../utils/constants.js';
import { EditIcon, TrashIcon, CalendarIcon, CreditCardIcon } from './Icons.jsx';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const { _id, amount, category, description, date, paymentMethod } = expense;
  const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.Others;
  const paymentBadge = PAYMENT_METHOD_BADGES[paymentMethod] || PAYMENT_METHOD_BADGES.Other;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3">
        {/* Left Side: Category and Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
            <span
              className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dot}`} />
              <span>{category}</span>
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${paymentBadge}`}>
              {paymentMethod || 'Cash'}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-semibold text-slate-900 truncate" title={description}>
            {description}
          </h4>

          <div className="mt-2 flex items-center space-x-4 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(date)}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Amount and Actions */}
        <div className="text-right flex-shrink-0 flex flex-col justify-between items-end">
          <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {formatINR(amount)}
          </span>

          <div className="mt-3 flex items-center space-x-1 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(expense)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="Edit expense"
              aria-label="Edit expense"
            >
              <EditIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(expense)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete expense"
              aria-label="Delete expense"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
