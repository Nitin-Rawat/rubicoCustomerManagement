import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = type === 'success' ? CheckCircle : XCircle;
  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} shadow-lg animate-slide-in-right`}>
      <Icon className={iconColor} size={20} />
      <p className={`${textColor} font-medium`}>{message}</p>
      <button
        onClick={onClose}
        className={`${textColor} hover:opacity-70 transition-opacity`}
      >
        <X size={18} />
      </button>
    </div>
  );
};
