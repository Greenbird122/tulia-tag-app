import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';
import { toast } from '../components/Toast';

export default function Notifications() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    lostModeAlerts: true,
    helperSightings: true,
    lowBattery: true,
    emailNotifications: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    toast('Notification preferences saved');
    navigate('/settings');
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto pb-24 px-6 pt-12 h-full">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4">
          <SafeIcon icon={FiIcons.FiArrowLeft} className="text-2xl text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
        {[
          { key: 'lostModeAlerts', label: 'Lost Mode Alerts', desc: 'Get notified when Lost Mode is activated' },
          { key: 'helperSightings', label: 'Helper Sightings', desc: 'When someone reports seeing your item' },
          { key: 'lowBattery', label: 'Low Battery Warnings', desc: 'Alert when tracker battery is below 20%' },
          { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-5">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">{item.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
            <button
              onClick={() => handleToggle(item.key)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings[item.key] ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[item.key] ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="w-full mt-8 bg-brand-500 text-white py-4 rounded-xl font-semibold shadow-lg"
      >
        Save Preferences
      </button>
    </div>
  );
}