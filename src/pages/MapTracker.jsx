import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { api } from '../services/mockApi';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';
import BottomSheet from '../components/BottomSheet';
import { toast } from '../components/Toast';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../lib/supabase';

export default function MapTracker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [viewState, setViewState] = useState(null);
  const [lostSheetOpen, setLostSheetOpen] = useState(false);
  const [lostDuration, setLostDuration] = useState(24);
  const [codeInfo, setCodeInfo] = useState(null);

  useEffect(() => {
  const fetchInitialLocation = async () => {
    const data = await api.getDeviceLocation(id);
    if (data) {
      setDevice(data);
      if (!viewState) {
        setViewState({ longitude: data.lng, latitude: data.lat, zoom: 15 });
      }
    }
  };
  fetchInitialLocation();

  // Subscribe to realtime changes for this device
  const channel = supabase
    .channel(`device-${id}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'devices',
        filter: `id=eq.${id}`
      },
      (payload) => {
        const updatedDevice = payload.new;
        setDevice(updatedDevice);
        // Optionally pan map to new location
        setViewState(prev => ({
          ...prev,
          longitude: updatedDevice.lng,
          latitude: updatedDevice.lat
        }));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [id]);

  const handleRingBuzzer = async () => {
    await api.ringBuzzer(id);
    toast('Buzzer command sent!');
  };

  const handleActivateLostMode = async () => {
    const res = await api.startLostMode(id, lostDuration);
    setCodeInfo(res.code);
    toast('Lost mode activated!', 'error');
    setLostSheetOpen(false);
    // Refresh device
    const data = await api.getLocation(id);
    setDevice(data);
  };

  const handleDeactivateLostMode = async () => {
    await api.endLostMode(id);
    toast('Lost mode deactivated');
    setCodeInfo(null);
    const data = await api.getLocation(id);
    setDevice(data);
  };

  const shareCode = () => {
    const url = `${window.location.origin}/#/track/${codeInfo}`;
    navigator.clipboard.writeText(url);
    toast('Tracking link copied to clipboard!');
  };

  if (!device || !viewState) return <div className="flex-1 bg-gray-100 animate-pulse" />;

  const isLost = device.status === 'lost';

  return (
    <div className="flex-1 relative h-full w-full bg-gray-100">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <Marker longitude={device.lng} latitude={device.lat}>
          <div className="relative">
            <div className={`absolute -inset-4 rounded-full opacity-20 animate-ping ${isLost ? 'bg-red-500' : 'bg-brand-500'}`} />
            <div className={`w-8 h-8 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white relative z-10 transition-colors ${
              isLost ? 'bg-red-500' : 'bg-brand-500'
            }`}>
              <SafeIcon icon={FiIcons.FiBriefcase} className="text-xs" />
            </div>
          </div>
        </Marker>
      </Map>

      {/* Top Bar Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 pt-12 bg-gradient-to-b from-black/50 to-transparent pointer-events-none flex justify-between items-start">
        <button onClick={() => navigate('/')} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-800 pointer-events-auto">
          <SafeIcon icon={FiIcons.FiArrowLeft} />
        </button>
        <div className="bg-white px-4 py-2 rounded-full shadow-lg pointer-events-auto flex flex-col items-end">
          <span className="text-sm font-bold">{device.name}</span>
          <span className="text-[10px] text-gray-500">Updated {formatDistanceToNow(device.lastUpdated)} ago</span>
        </div>
      </div>

      {/* Bottom Action Cards */}
      <div className="absolute bottom-6 left-0 w-full px-4 pointer-events-none">
        <div className="bg-white rounded-3xl p-5 shadow-2xl pointer-events-auto space-y-4">
          {isLost && codeInfo && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex flex-col items-center">
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Lost Mode Active</span>
              <div className="text-2xl font-black font-mono tracking-widest text-gray-900 my-2">{codeInfo}</div>
              <button onClick={shareCode} className="text-brand-500 text-sm font-semibold flex items-center">
                <SafeIcon icon={FiIcons.FiShare2} className="mr-2" /> Share Tracking Link
              </button>
            </div>
          )}

          <div className="flex space-x-3">
            <button 
              onClick={handleRingBuzzer}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center"
            >
              <SafeIcon icon={FiIcons.FiBell} className="mr-2 text-lg" /> Ring
            </button>
            
            {!isLost ? (
              <button 
                onClick={() => setLostSheetOpen(true)}
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center"
              >
                <SafeIcon icon={FiIcons.FiAlertTriangle} className="mr-2 text-lg" /> Report Lost
              </button>
            ) : (
              <button 
                onClick={handleDeactivateLostMode}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-green-500/30 transition-all flex items-center justify-center"
              >
                <SafeIcon icon={FiIcons.FiCheckCircle} className="mr-2 text-lg" /> Bag Found
              </button>
            )}
          </div>
        </div>
      </div>

      <BottomSheet isOpen={lostSheetOpen} onClose={() => setLostSheetOpen(false)} title="Activate Lost Mode">
        <p className="text-gray-500 text-sm mb-6">Generates a public tracking link that helpers can use to pinpoint your bag's location.</p>
        <div className="space-y-3 mb-8">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Duration</label>
          <div className="grid grid-cols-4 gap-2">
            {[6, 12, 24, 48].map(h => (
              <button 
                key={h}
                onClick={() => setLostDuration(h)}
                className={`py-3 rounded-xl text-sm font-semibold border ${lostDuration === h ? 'bg-brand-50 border-brand-500 text-brand-600' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={handleActivateLostMode}
          className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-red-500/30"
        >
          Confirm & Get Link
        </button>
      </BottomSheet>
    </div>
  );
}