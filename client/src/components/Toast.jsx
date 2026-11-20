import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const { message, type = 'success', id } = toast;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
      title: 'Success',
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
      title: 'Error',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
      title: 'Notice',
    },
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-200"
    >
      <div
        className={`flex items-start space-x-3 p-4 rounded-2xl border shadow-xl backdrop-blur-xs ${config.bg}`}
      >
        <div className="mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider opacity-75">
            {config.title}
          </p>
          <p className="text-sm font-medium mt-0.5 leading-snug break-words">
            {message}
          </p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
