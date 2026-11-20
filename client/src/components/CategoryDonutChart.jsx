import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatINR, CATEGORY_HEX_COLORS } from '../utils/constants.js';
import { Tag } from 'lucide-react';

// Custom Tooltip for the Donut Chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white rounded-xl px-3.5 py-2.5 shadow-xl text-xs space-y-1 border border-slate-700">
        <div className="flex items-center space-x-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-bold">{data.category}</span>
        </div>
        <div className="text-slate-200 font-semibold text-sm">
          {formatINR(data.total)}
        </div>
        <div className="text-slate-400 text-[11px]">
          {data.percentage}% of total spending ({data.count} {data.count === 1 ? 'entry' : 'entries'})
        </div>
      </div>
    );
  }
  return null;
};

const CategoryDonutChart = ({ categoryTotals = [], totalAmount = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // If no data or 0 total, show empty state
  if (!categoryTotals || categoryTotals.length === 0 || totalAmount <= 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full min-h-[360px]">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Spending by Category
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribution across expenditure types
          </p>
        </div>
        <div className="flex flex-col items-center justify-center my-auto py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Tag className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No category data yet</p>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            Add your first expense to visualize your category spending distribution.
          </p>
        </div>
      </div>
    );
  }

  // Prepare chart data with colors and percentages
  const chartData = categoryTotals.map((item) => {
    const percent = totalAmount > 0 ? Math.round((item.total / totalAmount) * 100) : 0;
    return {
      category: item.category,
      total: item.total,
      count: item.count,
      percentage: percent,
      color: CATEGORY_HEX_COLORS[item.category] || CATEGORY_HEX_COLORS.Others,
    };
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Spending by Category
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            {chartData.length} {chartData.length === 1 ? 'Category' : 'Categories'}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Proportional breakdown of your total expenditure
        </p>
      </div>

      {/* Donut Chart Container */}
      <div className="relative w-full h-64 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              cursor="pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                  className="transition-opacity duration-150"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label inside donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {activeIndex !== null ? chartData[activeIndex].category : 'Total'}
          </span>
          <span className="text-lg font-extrabold text-slate-900 tracking-tight">
            {activeIndex !== null
              ? formatINR(chartData[activeIndex].total)
              : formatINR(totalAmount)}
          </span>
        </div>
      </div>

      {/* Custom Clean Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-100">
        {chartData.map((item, idx) => (
          <div
            key={item.category}
            onMouseEnter={() => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(null)}
            className={`flex items-center space-x-2 p-1.5 rounded-lg cursor-pointer transition-colors ${
              activeIndex === idx ? 'bg-slate-100' : 'hover:bg-slate-50'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-800 truncate">
                {item.category}
              </div>
              <div className="text-[10px] text-slate-500">
                {formatINR(item.total)} ({item.percentage}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDonutChart;
