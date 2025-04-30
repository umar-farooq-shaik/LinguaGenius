import { useEffect } from "react";

interface ToastNotificationProps {
  show: boolean;
  message: string;
  icon: string;
  onClose: () => void;
}

export default function ToastNotification({ show, message, icon, onClose }: ToastNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 cursor-pointer z-50 animate-in fade-in slide-in-from-bottom-5"
    >
      {icon && <i className={icon + " text-lg"}></i>}
      <span>{message}</span>
    </div>
  );
}
