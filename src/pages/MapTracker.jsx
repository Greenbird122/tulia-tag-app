// src/pages/MapTracker.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as api from '../services/api';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';
import { toast } from '../components/Toast';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const NAIROBI_CENTER = { longitude: 36.8172, latitude: -1.2864, zoom: 12 };

export default function MapTracker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [viewState, setViewState] = useState(NAIROBI_CENTER);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const data = await api.getDeviceLocation(id);
        setDevice(data);
        if (data?.lat && data?.lng) {
          setViewState({ longitude: data.lng, latitude: data.lat, zoom: 17 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();

    const channel = supabase.channel(`device-${id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'devices', 
        filter: `id=eq.${id}` 
      }, (payload) => {
        setDevice(payload.new);
        if (payload.new.lat && payload.new.lng) {
          setViewState({ longitude: payload.new.lng, latitude: payload.new.lat, zoom: 17 });
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [id]);

  const isLost = device?.status === 'lost';

  const toggleLostMode = async () => {
    try {
      const newStatus = isLost ? 'safe' : 'lost';
      await api.toggleLostMode(id, newStatus);
      toast(isLost ? 'Lost Mode deactivated' : 'Lost Mode activated!', 'success');
    } catch (err) {
      toast('Failed to update status', 'error');
    }
  };

  const ringBuzzer = async () => {
    try {
      await api.ringBuzzer(id);
      toast('📳 Buzzer ringing on device!', 'success');
    } catch (err) {
      toast('Failed to ring buzzer', 'error');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><SafeIcon icon={FiIcons.FiLoader} className="animate-spin text-5xl text-brand-500" /></div>;
  }

  return (
    <div className="relative h-screen w-full bg-gray-100 dark:bg-gray-950 overflow-hidden">
      <Map
        {...viewState}
        onMove={e => setViewState(e.viewState)}
        mapStyle={mapError ? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' : 'mapbox://styles/mapbox/streets-v12'}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onError={() => setMapError(true)}
        style={{ width: '100%', height: '100%' }}
      >
        {device?.lat && device?.lng && (
          <Marker longitude={device.lng} latitude={device.lat}>
            <div className={`w-12 h-12 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center text-white ${isLost ? 'bg-red-500' : 'bg-brand-500'}`}>
              <SafeIcon icon={FiIcons.FiBriefcase} className="text-3xl" />
            </div>
          </Marker>
        )}
      </Map>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 pt-12 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex justify-between items-center text-white">
          <button onClick={() => navigate(-1)}><SafeIcon icon={FiIcons.FiArrowLeft} className="text-2xl" /></button>
          <div className="text-center">
            <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${isLost ? 'bg-red-500' : 'bg-brand-500'}`}>
              {isLost ? 'LOST MODE' : 'LIVE'}
            </div>
            <p className="font-semibold">{device?.name}</p>
          </div>
          <div className="w-8" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50">
        <button
          onClick={toggleLostMode}
          className={`px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center gap-2 ${isLost ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
        >
          <SafeIcon icon={FiIcons.FiAlertTriangle} />
          {isLost ? 'End Lost Mode' : 'Activate Lost Mode'}
        </button>

        <button
          onClick={ringBuzzer}
          className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-semibold shadow-lg flex items-center gap-2"
        >
          <SafeIcon icon={FiIcons.FiBell} />
          Ring Buzzer
        </button>
      </div>
    </div>
  );
}
