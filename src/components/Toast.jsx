import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const toastEvent = {
  listeners: [],
  emit(message, type = 'success') {
    this.listeners.forEach(cb => cb(message, type));
  },
  on(cb) {
    this.listeners.push(cb);
    return () => { this.listeners = this.listeners.filter(l => l !== cb); }
  }
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const cleanup = toastEvent.on((message, type) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    });
    return cleanup;
  }, []);

  return (
    <div className="absolute top-10 left-0 w-full flex flex-col items-center z-[100] px-4 pointer-events-none space-y-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white max-w-sm w-full text-center ${t.type === 'error' ? 'bg-red-500' : 'bg-gray-800'}`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export const toast = (message, type = 'success') => toastEvent.emit(message, type);