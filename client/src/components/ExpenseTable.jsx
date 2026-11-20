import React from 'react';
import { formatINR, formatDate, CATEGORY_COLORS, PAYMENT_METHOD_BADGES } from '../utils/constants.js';
import { EditIcon, TrashIcon } from './Icons.jsx';

const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
          <tr>
            <th scope="col" className="px-6 py-3.5">
              Description
            </th>
            <th scope="col" className="px-6 py-3.5">
              Category
            </th>
            <th scope="col" className="px-6 py-3.5">
              Date
            </th>
            <th scope="col" className="px-6 py-3.5">
              Method
            </th>
            <th scope="col" className="px-6 py-3.5 text-right">
              Amount (INR)
            </th>
            <th scope="col" className="px-6 py-3.5 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {expenses.map((expense) => {
            const { _id, amount, category, description, date, paymentMethod } = expense;
            const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.Others;
            const paymentBadge = PAYMENT_METHOD_BADGES[paymentMethod] || PAYMENT_METHOD_BADGES.Other;

            return (
              <tr key={_id} className="hover:bg-slate-50/70 transition-colors group">
                <td className="px-6 py-4 font-semibold text-slate-900 max-w-xs truncate" title={description}>
                  {description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dot}`} />
                    <span>{category}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  {formatDate(date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${paymentBadge}`}>
                    {paymentMethod || 'Cash'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-slate-900">
                  {formatINR(amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-1">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
