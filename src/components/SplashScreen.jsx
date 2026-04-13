// src/components/SplashScreen.jsx
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
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center 
                     bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 
                     dark:from-gray-950 dark:to-gray-900 overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -left-20 w-96 h-96 border-8 border-white/30 dark:border-white/10 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-20 -right-20 w-96 h-96 border-8 border-white/20 dark:border-white/10 rounded-full"
            />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="relative mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-full bg-white/30 dark:bg-white/10 animate-ping" />
              <div className="w-28 h-28 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex items-center justify-center">
                <SafeIcon icon={FiIcons.FiBriefcase} className="text-6xl text-brand-600 dark:text-brand-400" />
              </div>
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-6xl font-bold text-white dark:text-white tracking-tighter"
          >
            Tulia Tag
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/80 dark:text-white/70 text-lg mt-2 tracking-wide"
          >
            Your bag. Your code. Your control.
          </motion.p>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex gap-1"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                className="w-3 h-3 bg-white dark:bg-white rounded-full"
              />
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-white/50 dark:text-white/40 text-xs mt-8 font-mono tracking-[2px]"
          >
            CONNECTING TO YOUR TRACKERS...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}