import React from 'react';
import { formatINR, formatDate, CATEGORY_COLORS, PAYMENT_METHOD_BADGES } from '../utils/constants.js';
import CategoryIcon from './CategoryIcon.jsx';
import { Edit3, Trash2, Calendar, CreditCard, Banknote, Smartphone } from 'lucide-react';

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const { _id, amount, category, description, date, paymentMethod } = expense;
  const paymentBadge = PAYMENT_METHOD_BADGES[paymentMethod] || PAYMENT_METHOD_BADGES.Other;

  const PaymentIcon =
    paymentMethod === 'Cash'
      ? Banknote
      : paymentMethod === 'UPI'
      ? Smartphone
      : CreditCard;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3">
        {/* Left: Category Icon + Description */}
        <div className="flex items-start space-x-3.5 min-w-0 flex-1">
          <CategoryIcon category={category} size="md" />

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1 flex-wrap gap-y-1">
              <span className="text-xs font-bold text-slate-800">
                {category}
              </span>
              <span
                className={`inline-flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${paymentBadge}`}
              >
                <PaymentIcon className="w-3 h-3" />
                <span>{paymentMethod || 'Cash'}</span>
              </span>
            </div>

            <h4
              className="text-sm font-semibold text-slate-900 truncate tracking-tight"
              title={description}
            >
              {description}
            </h4>

            <div className="mt-1.5 flex items-center space-x-1 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(date)}</span>
            </div>
          </div>
        </div>

        {/* Right: Amount & Actions */}
        <div className="text-right flex-shrink-0 flex flex-col justify-between items-end">
          <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {formatINR(amount)}
          </span>

          <div className="mt-3 flex items-center space-x-1 opacity-90 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(expense)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Edit transaction"
              aria-label={`Edit ${description}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(expense)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Delete transaction"
              aria-label={`Delete ${description}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
