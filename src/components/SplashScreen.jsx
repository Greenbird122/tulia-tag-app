import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from './SafeIcon';
import * as FiIcons from 'react-icons/fi';

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete(), 600);
    }, 2600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 dark:from-gray-950 dark:to-black overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity }} className="absolute -top-20 -left-20 w-96 h-96 border-8 border-white/30 rounded-full" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity }} className="absolute -bottom-20 -right-20 w-96 h-96 border-8 border-white/20 rounded-full" />
          </div>

          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mb-8">
            <div className="absolute -inset-6 rounded-full bg-white/30 animate-ping" />
            <div className="w-28 h-28 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex items-center justify-center">
              <SafeIcon icon={FiIcons.FiBriefcase} className="text-6xl text-brand-600 dark:text-brand-400" />
            </div>
          </motion.div>

          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl font-bold text-white tracking-tighter">Tulia Tag</motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-white/80 text-lg mt-2">Your bag. Your code. Your control.</motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 flex gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div key={i} animate={{ y: [0, -12, 0] }} transition={{ delay: i * 0.15 }} className="w-3 h-3 bg-white rounded-full" />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
