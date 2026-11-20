import React from 'react';

const LoadingSpinner = ({ message = 'Loading expenses...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-emerald-200 border-t-emerald-600 rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-3 text-sm text-slate-500 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
