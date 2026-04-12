// src/services/api.js
import { supabase } from '../lib/supabase';

const RENDER_URL = import.meta.env.VITE_RENDER_API_URL || '';

// ==================== DEVICES ====================
export const getDevices = async (ownerId) => {
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

// ==================== LOST MODE ====================
export const startLostMode = async (deviceId, durationHours = 24) => {
  const code = `TULIA-${Math.floor(1000 + Math.random() * 9000)}`;
  const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();

  // Update device status to lost
  const { error: deviceError } = await supabase
    .from('devices')
    .update({ status: 'lost' })
    .eq('id', deviceId);
  if (deviceError) throw deviceError;

  // Insert lost session
  const { data, error } = await supabase
    .from('lost_sessions')
    .insert({
      device_id: deviceId,
      code,
      expires_at: expiresAt,
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;
  return { code, session: data };
};

export const endLostMode = async (deviceId) => {
  const { error: deviceError } = await supabase
    .from('devices')
    .update({ status: 'safe' })
    .eq('id', deviceId);
  if (deviceError) throw deviceError;

  const { error } = await supabase
    .from('lost_sessions')
    .update({ status: 'ended' })
    .eq('device_id', deviceId)
    .eq('status', 'active');
  if (error) throw error;
};

// ==================== RING BUZZER ====================
export const ringBuzzer = async (deviceId) => {
  if (!RENDER_URL) throw new Error('VITE_RENDER_API_URL is not set in .env');

  const res = await fetch(`${RENDER_URL}/api/ring-buzzer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to ring buzzer');
  }
  return { success: true };
};

// ==================== PUBLIC FUNCTIONS ====================
export const getLostSession = async (code) => {
  const { data, error } = await supabase
    .from('lost_sessions')
    .select('*, devices(lat, lng)')
    .eq('code', code)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) throw new Error('Invalid or expired tracking code');
  return {
    session: data,
    location: { lat: data.devices?.lat, lng: data.devices?.lng }
  };
};

export const reportSighting = async (sessionId, lat, lng, message) => {
  await supabase.from('sightings').insert({ session_id: sessionId, lat, lng, message });
};