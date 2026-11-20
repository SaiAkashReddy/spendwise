import React from 'react';

/**
 * Skeleton placeholder for the 4 dashboard metric cards
 */
export const SkeletonSummaryCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 bg-slate-200 rounded-md" />
          <div className="w-8 h-8 rounded-xl bg-slate-100" />
        </div>
        <div className="h-7 w-32 bg-slate-200 rounded-lg" />
        <div className="h-2.5 w-24 bg-slate-100 rounded-md" />
      </div>
    ))}
  </div>
);

/**
 * Skeleton placeholder for the 2 analytics charts
 */
export const SkeletonCharts = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs h-80 flex flex-col justify-between"
      >
        <div className="space-y-1.5">
          <div className="h-4 w-36 bg-slate-200 rounded-md" />
          <div className="h-3 w-48 bg-slate-100 rounded-md" />
        </div>
        <div className="h-44 w-full bg-slate-100 rounded-xl" />
        <div className="h-3 w-28 bg-slate-100 rounded-md" />
      </div>
    ))}
  </div>
);

/**
 * Skeleton placeholder for table rows
 */
export const SkeletonTable = ({ rows = 5 }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs animate-pulse">
    <div className="h-10 bg-slate-50 border-b border-slate-100 px-6 flex items-center">
      <div className="h-3 w-32 bg-slate-200 rounded-md" />
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center justify-between space-x-4">
          <div className="space-y-1.5 flex-1">
            <div className="h-4 w-48 bg-slate-200 rounded-md" />
            <div className="h-2.5 w-24 bg-slate-100 rounded-md" />
          </div>
          <div className="h-6 w-20 bg-slate-100 rounded-full" />
          <div className="h-4 w-20 bg-slate-200 rounded-md" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Skeleton placeholder for mobile cards
 */
export const SkeletonCardList = ({ count = 4 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between space-x-4"
      >
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-16 bg-slate-200 rounded-full" />
            <div className="h-5 w-12 bg-slate-100 rounded-full" />
          </div>
          <div className="h-4 w-36 bg-slate-200 rounded-md" />
          <div className="h-2.5 w-20 bg-slate-100 rounded-md" />
        </div>
        <div className="h-5 w-16 bg-slate-200 rounded-md" />
      </div>
    ))}
  </div>
);
