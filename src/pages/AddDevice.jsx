import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';

export default function AddDevice() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deviceId.trim() || !deviceName.trim()) {
      toast('Please fill all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('devices').insert({
        id: deviceId.trim().toUpperCase(),
        owner_id: user.id,
        name: deviceName.trim(),
        lat: 0,
        lng: 0,
        battery: 100,
        status: 'safe',
        last_updated: new Date(),
      });

      if (error) {
        if (error.code === '23505') {
          toast('Device ID already exists', 'error');
        } else {
          throw error;
        }
      } else {
        toast('Device added successfully!');
        navigate('/');
      }
    } catch (error) {
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-24 px-6 pt-12 h-full">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4">
          <SafeIcon icon={FiIcons.FiArrowLeft} className="text-2xl text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Tracker</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm space-y-5">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
            Device ID
          </label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase"
            placeholder="e.g., TAG001"
            maxLength={20}
          />
          <p className="text-xs text-gray-400 mt-1">Found on the back of your tracker</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
            Device Name
          </label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="e.g., My Backpack"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 text-white py-4 rounded-xl font-semibold shadow-lg disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Tracker'}
        </button>
      </form>
    </div>
  );
}