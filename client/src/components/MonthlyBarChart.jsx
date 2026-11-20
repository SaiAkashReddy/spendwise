import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatINR, formatMonthYear, getLastNMonths } from '../utils/constants.js';
import { Calendar } from 'lucide-react';

// Custom Tooltip for the Monthly Bar Chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white rounded-xl px-3.5 py-2.5 shadow-xl text-xs space-y-1 border border-slate-700">
        <div className="font-bold text-slate-300">{data.monthLabel}</div>
        <div className="text-emerald-400 font-bold text-sm">
          {formatINR(data.total)}
        </div>
        <div className="text-slate-400 text-[11px]">
          {data.count} {data.count === 1 ? 'transaction' : 'transactions'}
        </div>
      </div>
    );
  }
  return null;
};

// Compact Y-axis formatter (e.g. 1500 -> ₹1.5k)
const formatYAxis = (val) => {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
  return `₹${val}`;
};

const MonthlyBarChart = ({ monthlyTotals = [] }) => {
  // If no data exists at all
  const hasData = monthlyTotals && monthlyTotals.length > 0;

  // Prepare chronological last 6 months data, filling missing months with 0
  const last6Months = getLastNMonths(6); // e.g. ['2026-06', ..., '2026-11']

  const chartData = last6Months.map((monthKey) => {
    const existing = monthlyTotals.find((m) => m.month === monthKey);
    return {
      monthKey,
      monthLabel: formatMonthYear(monthKey),
      total: existing ? existing.total : 0,
      count: existing ? existing.count : 0,
    };
  });

  const total6MonthSum = chartData.reduce((acc, curr) => acc + curr.total, 0);

  if (!hasData && total6MonthSum === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full min-h-[360px]">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Monthly Spending Trend
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Spending history across the last 6 calendar months
          </p>
        </div>
        <div className="flex flex-col items-center justify-center my-auto py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No monthly history yet</p>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            Expenses will be organized by calendar month as you record transactions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Monthly Spending Trend
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Last 6 months expenditure timeline
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
          Last 6 Months
        </span>
      </div>

      {/* Bar Chart Container */}
      <div className="w-full h-64 my-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="monthLabel"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={44}>
              {chartData.map((entry, index) => {
                const isCurrentMonth = index === chartData.length - 1;
                return (
                  <Cell
                    key={`bar-${index}`}
                    fill={isCurrentMonth ? '#059669' : '#10b981'}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
        <span>6-Month Total: <strong className="text-slate-800">{formatINR(total6MonthSum)}</strong></span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
          <span className="text-[11px] text-slate-500">Current Month Highlighted</span>
        </span>
      </div>
    </div>
  );
};

export default MonthlyBarChart;
