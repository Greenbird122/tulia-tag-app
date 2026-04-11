// src/services/api.js
import { supabase } from '../lib/supabase';

// ------------------- Devices -------------------
export const getDevices = async () => {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
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

export const updateDeviceLocation = async (deviceId, lat, lng) => {
  const { error } = await supabase
    .from('devices')
    .update({ lat, lng, last_updated: new Date() })
    .eq('id', deviceId);
  if (error) throw error;
};

// ------------------- Lost Sessions -------------------
export const startLostMode = async (deviceId, durationHours) => {
  // Generate a random 4-digit code
  const code = `TULIA-${Math.floor(1000 + Math.random() * 9000)}`;
  const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

  // First, set device status to 'lost'
  await supabase.from('devices').update({ status: 'lost' }).eq('id', deviceId);

  // Insert the session
  const { data, error } = await supabase
    .from('lost_sessions')
    .insert({
      device_id: deviceId,
      code,
      expires_at: expiresAt.toISOString(),
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;
  return { code, session: data };
};

export const endLostMode = async (deviceId) => {
  // Update device status
  await supabase.from('devices').update({ status: 'safe' }).eq('id', deviceId);

  // Mark all active sessions for this device as 'ended'
  await supabase
    .from('lost_sessions')
    .update({ status: 'ended' })
    .eq('device_id', deviceId)
    .eq('status', 'active');
};

export const getLostSession = async (code) => {
  const { data, error } = await supabase
    .from('lost_sessions')
    .select('*, devices(lat, lng)')
    .eq('code', code)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) throw new Error('Invalid or expired code');
  return {
    session: data,
    location: { lat: data.devices.lat, lng: data.devices.lng }
  };
};

// ------------------- Sightings -------------------
export const reportSighting = async (sessionId, lat, lng, message) => {
  const { error } = await supabase
    .from('sightings')
    .insert({
      session_id: sessionId,
      lat,
      lng,
      message
    });
  if (error) throw error;

  // Also update the device's location (helpful for owner)
  const { data: session } = await supabase
    .from('lost_sessions')
    .select('device_id')
    .eq('id', sessionId)
    .single();

  if (session) {
    await supabase
      .from('devices')
      .update({ lat, lng, last_updated: new Date() })
      .eq('id', session.device_id);
  }
};

export const ringBuzzer = async (deviceId) => {
  // In a real app, you'd send a push notification or IoT command.
  // For now, we just log it or you could store a "ring_request" record.
  console.log(`Buzzer ringing on device ${deviceId}`);
  return { success: true };
};

// ------------------- History -------------------
export const getHistory = async () => {
  const { data, error } = await supabase
    .from('lost_sessions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};