// src/pages/History.jsx
import React, { useEffect, useState } from 'react';
import * as api from '../services/api';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '@/components/SafeIcon';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;   // ← Critical safety guard

    const fetchHistory = async () => {
      try {
        const data = await api.getHistory(user.id);
        setSessions(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [user, loading]);

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto pb-24 px-6 pt-12 h-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">History</h1>
      
      {sessions.length === 0 ? (
        <div className="text-center text-gray-400 dark:text-gray-500 mt-20">
          <SafeIcon icon={FiIcons.FiClock} className="text-5xl mx-auto mb-4 opacity-20" />
          <p>No past tracking sessions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map(s => (
            <div key={s.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${s.status === 'active' ? 'bg-red-50 dark:bg-red-900/30 text-red-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                    <SafeIcon icon={FiIcons.FiMapPin} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Session {s.code}</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {isValid(parseISO(s.created_at)) 
                        ? formatDistanceToNow(parseISO(s.created_at), { addSuffix: true })
                        : 'Unknown date'}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${s.status === 'active' ? 'bg-red-100 dark:bg-red-900 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600'}`}>
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