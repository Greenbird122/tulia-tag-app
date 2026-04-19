// src/services/api.js
import { supabase } from '../lib/supabase';

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
    .select('*')
    .eq('id', deviceId)
    .single();
  if (error) throw error;
  return data;
};

export const toggleLostMode = async (deviceId, status) => {
  const { error } = await supabase
    .from('devices')
    .update({ 
      status: status,
      last_updated: new Date().toISOString()
    })
    .eq('id', deviceId);
  if (error) throw error;
};

export const ringBuzzer = async (deviceId) => {
  const { error } = await supabase
    .from('devices')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', deviceId);
  if (error) throw error;
};

export const getLostSession = async (code) => {
  const { data, error } = await supabase
    .from('lost_sessions')
    .select('*, devices(*)')
    .eq('code', code)
    .single();
  if (error) throw error;
  return data;
};

export const reportSighting = async (sessionId, lat, lng, note) => {
  const { error } = await supabase
    .from('sightings')
    .insert({ session_id: sessionId, lat, lng, note });
  if (error) throw error;
};

export const getHistory = async (ownerId) => {
  const { data, error } = await supabase
    .from('lost_sessions')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};