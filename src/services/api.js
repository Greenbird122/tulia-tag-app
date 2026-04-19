// src/services/api.js
import { supabase } from '../lib/supabase';

const RENDER_URL = import.meta.env.VITE_RENDER_API_URL || '';

export const getDevices = async (ownerId) => {
  if (!ownerId) throw new Error('ownerId is required');
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('owner_id', ownerId)
    .order('last_updated', { ascending: false });
  if (error) throw error;
  return data;
};

export const getDeviceLocation = async (deviceId) => {
  const { data, error } = await supabase
    .from('devices')
    .select('lat, lng, last_updated, status, battery, name')
    .eq('id', deviceId)
    .single();
  if (error) throw error;
  return data;
};

export const getHistory = async (ownerId) => {
  const { data, error } = await supabase
    .from('lost_sessions')
    .select('*, devices!inner(owner_id)')
    .eq('devices.owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// ... (rest of your api functions - startLostMode, endLostMode, ringBuzzer, getLostSession, reportSighting)
