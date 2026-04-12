import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as api from '../services/api';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';
import { toast } from '../components/Toast';

const NAIROBI_CENTER = { 
  longitude: 36.8172, 
  latitude: -1.2864, 
  zoom: 12 
};

export default function HelperPublic() {
  const { code } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [viewState, setViewState] = useState(NAIROBI_CENTER);
  const [error, setError] = useState('');
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef(null);

  // Immediate validation
  useEffect(() => {
    if (!code || code === 'undefined') {
      setError('Invalid tracking link.');
    }
  }, [code]);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current.resize(), 150);
    }
  }, [viewState]);

  useEffect(() => {
    if (!code || code === 'undefined' || error) return;

    const fetchSession = async () => {
      try {
        const data = await api.getLostSession(code);
        setSessionData(data);

        if (data.location.lat && data.location.lng) {
          setViewState({
            longitude: data.location.lng,
            latitude: data.location.lat,
            zoom: 17,
          });
        }
        setError('');
      } catch (err) {
        setError('Tracking link is invalid or has expired.');
      }
    };

    fetchSession();
    const interval = setInterval(fetchSession, 4000);
    return () => clearInterval(interval);
  }, [code, error]);

  const handleSeeBag = () => {
    if (!sessionData) return;
    if (navigator.geolocation) {
      toast('Locating you...');
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await api.reportSighting(sessionData.session.id, pos.coords.latitude, pos.coords.longitude, "Helper spotted the bag!");
          toast('Report sent! Owner notified.', 'success');
        },
        () => {
          api.reportSighting(sessionData.session.id, viewState.latitude, viewState.longitude, "Helper spotted the bag!");
          toast('Report sent! Owner notified.', 'success');
        }
      );
    } else {
      toast('Geolocation not supported', 'error');
    }
  };

  const handleRing = async () => {
    if (!sessionData) return;
    await api.ringBuzzer(sessionData.session.device_id);
    toast('Buzzer ringing on the tracker...', 'success');
  };

  if (error) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 text-center h-full">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mb-4">
          <SafeIcon icon={FiIcons.FiAlertCircle} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Link</h2>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center h-full">
        <SafeIcon icon={FiIcons.FiLoader} className="animate-spin text-4xl text-brand-500" />
      </div>
    );
  }

  const mapStyle = mapError || !import.meta.env.VITE_MAPBOX_TOKEN
    ? {
        version: 8,
        sources: {
          'osm': { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256 }
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
      }
    : 'mapbox://styles/mapbox/streets-v12'; // Premium aesthetic

  const isLost = true; // Public page is always for lost items

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
        <Marker longitude={sessionData.location.lng} latitude={sessionData.location.lat}>
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-red-500 opacity-20 animate-ping" />
            <div className="w-11 h-11 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center text-white relative z-10 bg-red-500">
              <SafeIcon icon={FiIcons.FiBriefcase} className="text-2xl" />
            </div>
          </div>
        </Marker>
      </Map>

      {/* Header - matches your premium style */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 pt-12 bg-gradient-to-b from-black/70 via-black/40 to-transparent pointer-events-none">
        <div className="flex flex-col items-center">
          <div className="bg-red-500 text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-[1px] shadow-xl mb-2">
            LOST ITEM TRACKER
          </div>
          <p className="text-white text-base font-semibold drop-shadow-md">Help find this bag</p>
        </div>
      </div>

      {/* Action buttons - bottom sheet style */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] p-6 pb-8 space-y-4 z-50">
        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Are you near the bag?</h3>
        
        <button 
          onClick={handleSeeBag}
          className="w-full bg-brand-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center active:scale-95 transition-all"
        >
          <SafeIcon icon={FiIcons.FiEye} className="mr-2 text-xl" />
          I SEE THIS BAG
        </button>

        <button 
          onClick={handleRing}
          className="w-full bg-gray-100 text-gray-800 py-4 rounded-2xl font-bold text-lg flex items-center justify-center active:scale-95 transition-all"
        >
          <SafeIcon icon={FiIcons.FiBell} className="mr-2 text-xl" />
          RING BUZZER
        </button>
      </div>

      {/* Optional Nairobi fallback note */}
      {!sessionData.location.lat && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur text-xs text-gray-500 px-4 py-1 rounded-2xl shadow">
          Centered on Nairobi • Waiting for live update
        </div>
      )}
    </div>
  );
}