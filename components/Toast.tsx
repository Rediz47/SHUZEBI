import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-black shadow-2xl rounded-full"
        >
          <div className="bg-black text-white p-2 rounded-full">
            {type === 'success' && <Check size={14} />}
            {type === 'info' && <Info size={14} />}
            {type === 'error' && <AlertCircle size={14} />}
          </div>
          <span className="font-bold text-sm bg-white px-4 py-2 rounded-full shadow-sm">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;