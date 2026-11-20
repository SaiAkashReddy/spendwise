import React from 'react';
import { AlertCircleIcon, RefreshIcon } from './Icons.jsx';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 sm:p-5 text-rose-900 shadow-sm my-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-rose-600 mt-0.5">
          <AlertCircleIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-rose-900">Unable to load data</h4>
          <p className="mt-1 text-xs sm:text-sm text-rose-700 leading-relaxed">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
            >
              <RefreshIcon className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
