import React, { useEffect } from 'react';
import { Bell, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }[type];

  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between animate-slide-in`}>
      <div className="flex items-center gap-3">
        <Bell size={20} />
        <p>{message}</p>
      </div>
      <button onClick={onClose} className="hover:opacity-80">
        <X size={20} />
      </button>
    </div>
  );
}
