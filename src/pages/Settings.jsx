import React from 'react';
import { useAuth } from '../context/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-24 px-6 pt-12 h-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 mb-6 flex items-center space-x-4">
        <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-2xl font-bold">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden mb-6">
        {[
          { icon: FiIcons.FiUser, label: 'Edit Profile' },
          { icon: FiIcons.FiBell, label: 'Notifications' },
          { icon: FiIcons.FiLock, label: 'Privacy & Security' },
          { icon: FiIcons.FiHelpCircle, label: 'Help & Support' }
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center justify-between p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
            <div className="flex items-center text-gray-700">
              <SafeIcon icon={item.icon} className="mr-4 text-lg text-gray-400" />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            <SafeIcon icon={FiIcons.FiChevronRight} className="text-gray-300" />
          </button>
        ))}
      </div>

      <button 
        onClick={logout}
        className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl shadow-sm border border-gray-50"
      >
        Log Out
      </button>
    </div>
  );
}