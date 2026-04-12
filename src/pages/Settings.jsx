import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';   // ← NEW
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';
import { toast } from '../components/Toast';

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();   // ← NEW
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast('You have been logged out', 'success');
  };

  const menuItems = [
    { icon: FiIcons.FiUser, label: 'Edit Profile', path: '/edit-profile' },
    { icon: FiIcons.FiBell, label: 'Notifications', path: '/notifications' },
    { icon: FiIcons.FiLock, label: 'Privacy & Security', path: '/privacy-security' },
    { icon: FiIcons.FiHelpCircle, label: 'Help & Support', path: '/help-support' },
  ];

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto pb-24 px-6 pt-12 h-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      {/* DARK MODE TOGGLE */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <SafeIcon icon={FiIcons.FiSun} className="mr-4 text-xl" />
            <span className="font-medium">Dark Mode</span>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              theme === 'dark' ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                theme === 'dark' ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Rest of your settings (profile card + menu) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-700 mb-6 flex items-center space-x-4">
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center text-2xl font-bold">
          {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {user?.user_metadata?.full_name || 'User'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-700 overflow-hidden mb-6">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <SafeIcon icon={item.icon} className="mr-4 text-lg text-gray-400" />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            <SafeIcon icon={FiIcons.FiChevronRight} className="text-gray-300" />
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-white dark:bg-gray-800 text-red-500 font-bold py-4 rounded-2xl shadow-sm border border-gray-50 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
}