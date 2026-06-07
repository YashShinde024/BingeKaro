import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-20 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="pointer-events-auto w-full glass-card border border-white/[0.08] rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-start gap-3 relative overflow-hidden"
              style={{
                background: 'rgba(15, 15, 15, 0.75)',
              }}
            >
              {/* Type Accent Line */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-[4px] ${
                  toast.type === 'success'
                    ? 'bg-emerald-500'
                    : toast.type === 'error'
                    ? 'bg-rose-500'
                    : 'bg-accent'
                }`}
              />

              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-accent-light" />}
              </div>

              {/* Message */}
              <p className="text-[13px] font-medium text-white/95 leading-snug flex-1 pr-4">
                {toast.message}
              </p>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-0.5 text-muted hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
