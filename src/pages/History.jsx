import React, { useEffect, useState } from 'react';
import * as api from '../services/api';
// usage stays the same: api.getLocation(id)
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';
import { formatDistanceToNow } from 'date-fns';

export default function History() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await api.getHistory();
      setSessions(data.reverse()); // latest first
    };
    fetchHistory();
  }, []);

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto pb-24 px-6 pt-12 h-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">History</h1>
      
      {sessions.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <SafeIcon icon={FiIcons.FiClock} className="text-5xl mx-auto mb-4 opacity-20" />
          <p>No past tracking sessions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map(s => (
            <div key={s.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${s.status === 'active' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
                    <SafeIcon icon={FiIcons.FiMapPin} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Session {s.code}</h4>
                    <p className="text-xs text-gray-400">{formatDistanceToNow(parseInt(s.id))} ago</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${s.status === 'active' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}