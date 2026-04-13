// src/pages/About.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto pb-24 px-6 pt-12 h-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="mr-4">
            <SafeIcon icon={FiIcons.FiArrowLeft} className="text-2xl text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Tulia Tag</h1>
        </div>

        {/* Inventor Section */}
        <motion.div 
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-10 mb-10 text-center shadow-sm"
        >
          <div className="mx-auto w-28 h-28 bg-brand-100 dark:bg-brand-900 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <SafeIcon icon={FiIcons.FiBriefcase} className="text-7xl text-brand-600 dark:text-brand-400" />
          </div>
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tighter">Tulia Tag</h2>
          <p className="text-xl text-brand-500 font-semibold mt-2">Invented by Cassie</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">A personal mission turned into a powerful solution</p>
        </motion.div>

        {/* Long Content with Stagger */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="space-y-10"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Tulia Tag is a smart, real-time GPS tracking system designed to protect what matters most to you. 
              Whether it's your daily backpack, travel luggage, laptop bag, child's school bag, or any valuable item — 
              Tulia Tag gives you complete peace of mind through live location tracking, community help, and smart alerts.
            </p>
          </motion.div>

          {/* Team, Terms, Copyright sections – you can keep the long version from previous response */}
          {/* ... (paste the full long content from the previous About.jsx I sent) */}
        </motion.div>
      </motion.div>
    </div>
  );
}