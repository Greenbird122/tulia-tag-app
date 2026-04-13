// src/pages/MapTracker.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as api from '../services/api';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';
import { toast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const NAIROBI_CENTER = { longitude: 36.8172, latitude: -1.2864, zoom: 12 };

export default function MapTracker() {
  const { id } = useParams();
  const { user } = useAuth();
  const [device, setDevice] = useState(null);
  const [viewState, setViewState] = useState(NAIROBI_CENTER);
  const [error, setError] = useState('');
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef(null);

  // Initial fetch + Realtime subscription
  useEffect(() => {
    if (!id) {
      setError('Invalid tracker ID');
      return;
    }

    const fetchDevice = async () => {
      try {
        const data = await api.getDeviceLocation(id);
        setDevice(data);
        if (data.lat && data.lng && (data.lat !== 0 || data.lng !== 0)) {
          setViewState({ longitude: data.lng, latitude: data.lat, zoom: 17 });
        }
        setError('');
      } catch (err) {
        setError('Waiting for first location update...');
      }
    };

    fetchDevice();

    // Realtime subscription
    const channel = supabase
      .channel(`device-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log('Realtime device update:', payload.new);
          setDevice(payload.new);
          if (payload.new.lat && payload.new.lng) {
            setViewState({
              longitude: payload.new.lng,
              latitude: payload.new.lat,
              zoom: 17,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const toggleLostMode = async () => {
    if (!device) return;
    try {
      if (device.status === 'lost') {
        await api.endLostMode(device.id);
        toast('Lost Mode ended', 'success');
      } else {
        await api.startLostMode(device.id, 24);
        toast('Lost Mode activated!', 'success');
      }
    } catch (err) {
      toast(err.message || 'Failed to toggle Lost Mode', 'error');
    }
  };

  const handleRing = async () => {
    if (!device) return;
    try {
      await api.ringBuzzer(device.id);
      toast('Buzzer ringing!', 'success');
    } catch (err) {
      toast('Could not ring buzzer', 'error');
    }
  };

  if (error && !device) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 text-center h-full">
        <SafeIcon icon={FiIcons.FiAlertCircle} className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Tracking Error</h2>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center h-full">
        <SafeIcon icon={FiIcons.FiLoader} className="animate-spin text-4xl text-brand-500" />
      </div>
    );
  }

  const mapStyle = mapError || !import.meta.env.VITE_MAPBOX_TOKEN
    ? {
        version: 8,
        sources: { osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256 } },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
      }
    : 'mapbox://styles/mapbox/streets-v12';

  const isLost = device.status === 'lost';

  return (
    <div className="flex-1 relative h-full w-full bg-gray-100 overflow-hidden">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={mapStyle}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onError={() => setMapError(true)}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        {device.lat && device.lng && (device.lat !== 0 || device.lng !== 0) && (
          <Marker longitude={device.lng} latitude={device.lat}>
            <div className="relative flex items-center justify-center">
              {isLost && <div className="absolute -inset-8 rounded-full bg-red-500 opacity-30 animate-ping" />}
              <div className={`w-11 h-11 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center text-white relative z-10 transition-all ${isLost ? 'bg-red-500 animate-[blink_1.2s_infinite]' : 'bg-brand-500'}`}>
                <SafeIcon icon={FiIcons.FiBriefcase} className="text-3xl" />
              </div>
            </div>
          </Marker>
        )}
      </Map>
        <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="absolute top-0 left-0 right-0 z-50 p-6 pt-12 bg-gradient-to-b from-black/70 via-black/40 to-transparent pointer-events-none"
    >
      {/* header content */}
    </motion.div>

    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-2 flex gap-3 z-50"
    >
      {/* action buttons */}
    </motion.div>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 pt-12 bg-gradient-to-b from-black/70 via-black/40 to-transparent pointer-events-none">
        <div className="flex flex-col items-center">
          <div className={`px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-[1px] shadow-xl mb-2 ${isLost ? 'bg-red-500' : 'bg-brand-500'} text-white`}>
            {isLost ? 'LOST MODE • LIVE' : 'LIVE TRACKING'}
          </div>
          <p className="text-white text-base font-semibold drop-shadow-md">{device.name}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-2 flex gap-3 z-50">
        <button onClick={toggleLostMode} className={`px-8 py-4 rounded-3xl font-semibold text-sm flex items-center gap-2 transition-all ${isLost ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : 'bg-red-500 text-white'}`}>
          <SafeIcon icon={FiIcons.FiAlertTriangle} />
          {isLost ? 'End Lost Mode' : 'Activate Lost Mode'}
        </button>

        <button onClick={handleRing} className="px-8 py-4 bg-amber-500 text-white rounded-3xl font-semibold text-sm flex items-center gap-2 active:scale-95 transition-all">
          <SafeIcon icon={FiIcons.FiBell} />
          Ring Buzzer
        </button>
      </div>

      {/* Status */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-gray-800/95 backdrop-blur px-5 py-2.5 rounded-3xl shadow-xl text-xs text-gray-700 dark:text-gray-300 z-50 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isLost ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
        GPS Live • Realtime
      </div>

      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}