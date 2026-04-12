import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { supabase } from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';
import { formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;

    const fetchDevices = async () => {
      const data = await api.getDevices(user.id);
      setDevices(data);
    };

    fetchDevices();

    const channel = supabase
      .channel('devices-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, fetchDevices)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user, loading]);

  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
    return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : 'recently';
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto pb-24 px-6 pt-12 relative h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Trackers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Keep an eye on your belongings</p>
        </div>
        <button
          onClick={() => navigate('/add-device')}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 text-brand-500"
        >
          <SafeIcon icon={FiIcons.FiPlus} className="text-xl" />
        </button>
      </div>

      <div className="space-y-4">
        {devices.map(device => (
          <div
            key={device.id}
            onClick={() => navigate(`/map/${device.id}`)}
            className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 dark:border-gray-700 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
          >
            {/* Lost Mode badge */}
            {device.status === 'lost' && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                LOST MODE
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${device.status === 'lost' ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'bg-brand-100 dark:bg-brand-900/30 text-brand-500'}`}>
                  <SafeIcon icon={FiIcons.FiBriefcase} className="text-3xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{device.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID: {device.id}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400 dark:text-gray-500">Last seen</p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {formatLastUpdated(device.last_updated)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {devices.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <SafeIcon icon={FiIcons.FiBriefcase} className="text-5xl mx-auto mb-3 opacity-20" />
            <p>No trackers yet</p>
            <p className="text-sm mt-1">Tap + to add your first tracker</p>
          </div>
        )}
      </div>
    </div>
  );
}