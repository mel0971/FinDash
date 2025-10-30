import { useEffect, useState } from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-900/80 border-green-700',
    error: 'bg-red-900/80 border-red-700',
    info: 'bg-blue-900/80 border-blue-700',
  }[type];

  const icon = {
    success: <Check size={20} className="text-green-400" />,
    error: <AlertCircle size={20} className="text-red-400" />,
    info: <AlertCircle size={20} className="text-blue-400" />,
  }[type];

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} border rounded-lg p-4 flex items-center gap-3 animate-slide-up z-50 max-w-sm`}>
      {icon}
      <span className="text-white text-sm flex-1">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-white">
        <X size={16} />
      </button>
    </div>
  );
}
