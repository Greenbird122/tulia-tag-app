import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { api } from '../services/mockApi';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/common/SafeIcon';
import { toast } from '../components/Toast';

export default function HelperPublic() {
  const { code } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [viewState, setViewState] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await api.getLostSession(code);
        setSessionData(data);
        if (!viewState) {
          setViewState({ longitude: data.location.lng, latitude: data.location.lat, zoom: 16 });
        }
      } catch (err) {
        setError('Tracking link is invalid or has expired.');
      }
    };
    fetchSession();
    const interval = setInterval(fetchSession, 5000);
    return () => clearInterval(interval);
  }, [code]);

  const handleSeeBag = () => {
    if (navigator.geolocation) {
      toast('Locating you...');
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await api.reportSighting(sessionData.session.id, pos.coords.latitude, pos.coords.longitude, "Helper spotted the bag!");
          toast('Report sent! Owner notified.');
        },
        () => {
          // Fallback to current bag location simulation for demo
          api.reportSighting(sessionData.session.id, viewState.latitude, viewState.longitude, "Helper spotted the bag!");
          toast('Report sent! Owner notified.');
        }
      );
    } else {
      toast('Geolocation not supported', 'error');
    }
  };

  const handleRing = async () => {
    await api.ringBuzzer(sessionData.session.device_id);
    toast('Buzzer ringing...');
  };

  if (error) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mb-4">
          <SafeIcon icon={FiIcons.FiAlertCircle} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Session Ended</h2>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!sessionData || !viewState) return <div className="flex-1 bg-gray-100 flex items-center justify-center"><div className="animate-spin text-brand-500 text-3xl"><SafeIcon icon={FiIcons.FiLoader} /></div></div>;

  return (
    <div className="flex-1 relative h-full w-full bg-gray-100">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <Marker longitude={sessionData.location.lng} latitude={sessionData.location.lat}>
          <div className="relative">
            <div className={`absolute -inset-4 rounded-full opacity-20 animate-ping bg-red-500`} />
            <div className={`w-10 h-10 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white relative z-10 bg-red-500`}>
              <SafeIcon icon={FiIcons.FiBriefcase} className="text-lg" />
            </div>
          </div>
        </Marker>
      </Map>

      <div className="absolute top-0 left-0 w-full p-6 pt-12 bg-gradient-to-b from-black/60 to-transparent flex flex-col items-center pointer-events-none">
        <div className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg mb-2">
          Lost Item Tracker
        </div>
        <p className="text-white text-sm font-medium text-center shadow-sm">Help the owner find this bag</p>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 text-center mb-6">Are you near the bag?</h3>
        
        <button 
          onClick={handleSeeBag}
          className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/30 flex items-center justify-center transition-transform active:scale-[0.98]"
        >
          <SafeIcon icon={FiIcons.FiEye} className="mr-2 text-xl" /> I See This Bag
        </button>
        
        <button 
          onClick={handleRing}
          className="w-full bg-gray-100 text-gray-800 py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-transform active:scale-[0.98]"
        >
          <SafeIcon icon={FiIcons.FiBell} className="mr-2 text-xl" /> Ring Buzzer
        </button>
      </div>
    </div>
  );
}