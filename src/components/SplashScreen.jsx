// src/components/SplashScreen.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from './logo.jpeg';

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete(), 800);
    }, 6500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center 
                     bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 
                     overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity }} className="absolute -top-20 -left-20 w-96 h-96 border-8 border-white/30 rounded-full" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity }} className="absolute -bottom-20 -right-20 w-96 h-96 border-8 border-white/20 rounded-full" />
          </div>

          <motion.div
            initial={{ scale: 0.3, rotateX: -90, rotateY: -45, opacity: 0 }}
            animate={{ scale: 1.08, rotateX: 0, rotateY: 0, opacity: 1 }}
            transition={{ duration: 2.4, type: "spring", stiffness: 65, damping: 14 }}
            className="relative mb-10"
            style={{ perspective: '1400px' }}
          >
            <img 
              src={logoImage} 
              alt="Tulia Tag Logo"
              className="w-52 h-52 object-contain drop-shadow-2xl brightness-110 contrast-125 saturate-110 mix-blend-screen"
            />
          </motion.div>

          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-6xl font-bold text-white tracking-tighter drop-shadow-lg"
          >
            Tulia Tag
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="text-white/85 text-lg mt-2 tracking-wide"
          >
            Your bag. Your code. Your control.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            className="mt-16 flex gap-1"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                className="w-3 h-3 bg-white rounded-full"
              />
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
            className="text-white/50 text-xs mt-8 font-mono tracking-[2px]"
          >
            CONNECTING TO YOUR TRACKERS...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}