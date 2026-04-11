import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/mockApi';
import { createClient } from '@supabase/supabase-js';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';
import { formatDistanceToNow } from 'date-fns';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const fetchDevices = async () => {
    const data = await api.getDevices();
    setDevices(data);
  };
  fetchDevices();

  const channel = supabase
    .channel('devices-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => {
      fetchDevices(); // refresh the list
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-24 px-6 pt-12 relative h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Trackers</h1>
          <p className="text-sm text-gray-500 mt-1">Keep an eye on your belongings</p>
        </div>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-brand-500">
          <SafeIcon icon={FiIcons.FiPlus} className="text-xl" />
        </button>
      </div>

      <div className="space-y-4">
        {devices.map(device => (
          <div 
            key={device.id} 
            onClick={() => navigate(`/map/${device.id}`)}
            className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
          >
            {device.status === 'lost' && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Lost Mode
              </div>
            )}
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${device.status === 'lost' ? 'bg-red-50 text-red-500' : 'bg-brand-50 text-brand-500'}`}>
                <SafeIcon icon={FiIcons.FiBriefcase} className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{device.name}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <SafeIcon icon={FiIcons.FiMapPin} className="mr-1" />
                  Updated {formatDistanceToNow(device.lastUpdated)} ago
                </div>
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiIcons.FiBattery} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{device.battery}%</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                device.status === 'safe' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {device.status === 'safe' ? 'Nearby' : 'Missing'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}