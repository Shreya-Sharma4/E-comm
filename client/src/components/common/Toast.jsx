import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-200 bg-white shadow-emerald-100',
    error: 'border-rose-200 bg-white shadow-rose-100',
    info: 'border-sky-200 bg-white shadow-sky-100',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in max-w-md">
      <div
        className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg ${
          borderColors[toast.type] || borderColors.info
        } transition-all`}
      >
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium text-slate-800 flex-1">{toast.message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
