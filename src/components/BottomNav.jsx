// src/components/BottomNav.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/', icon: FiIcons.FiGrid, label: 'Devices' },
    { path: '/history', icon: FiIcons.FiClock, label: 'History' },
    { path: '/settings', icon: FiIcons.FiSettings, label: 'Settings' }
  ];

  return (
    <div className="absolute bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-safe pt-2 px-6 flex justify-between items-center z-40 h-[80px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path;
        return (
          <button 
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center w-16 h-12 transition-colors ${isActive ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            <SafeIcon icon={tab.icon} className="text-2xl mb-1" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}