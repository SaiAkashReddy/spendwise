import React from 'react';
import { formatINR, formatDate, PAYMENT_METHOD_BADGES } from '../utils/constants.js';
import CategoryIcon from './CategoryIcon.jsx';
import { Edit3, Trash2, Banknote, Smartphone, CreditCard } from 'lucide-react';

const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
        <thead className="bg-slate-50/80 text-slate-500 font-bold text-xs uppercase tracking-wider">
          <tr>
            <th scope="col" className="px-6 py-3.5">
              Category
            </th>
            <th scope="col" className="px-6 py-3.5">
              Description
            </th>
            <th scope="col" className="px-6 py-3.5">
              Date
            </th>
            <th scope="col" className="px-6 py-3.5">
              Payment Method
            </th>
            <th scope="col" className="px-6 py-3.5 text-right">
              Amount
            </th>
            <th scope="col" className="px-6 py-3.5 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {expenses.map((expense) => {
            const { _id, amount, category, description, date, paymentMethod } = expense;
            const paymentBadge = PAYMENT_METHOD_BADGES[paymentMethod] || PAYMENT_METHOD_BADGES.Other;

            const PaymentIcon =
              paymentMethod === 'Cash'
                ? Banknote
                : paymentMethod === 'UPI'
                ? Smartphone
                : CreditCard;

            return (
              <tr
                key={_id}
                className="hover:bg-slate-50/90 transition-colors duration-150 group"
              >
                {/* Category with Icon */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2.5">
                    <CategoryIcon category={category} size="sm" />
                    <span className="font-bold text-xs text-slate-800">
                      {category}
                    </span>
                  </div>
                </td>

                {/* Description */}
                <td className="px-6 py-4 font-semibold text-slate-900 max-w-xs truncate" title={description}>
                  {description}
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                  {formatDate(date)}
                </td>

                {/* Payment Method */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${paymentBadge}`}
                  >
                    <PaymentIcon className="w-3.5 h-3.5" />
                    <span>{paymentMethod || 'Cash'}</span>
                  </span>
                </td>

                {/* Amount (INR) */}
                <td className="px-6 py-4 whitespace-nowrap text-right font-black text-slate-900 tracking-tight">
                  {formatINR(amount)}
                </td>

                {/* Action Buttons */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
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
