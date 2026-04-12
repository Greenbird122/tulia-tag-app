// backend/routes/tracker.js   (or wherever your routes are)
import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = express.Router();

// ←←← THIS IS THE MAIN ENDPOINT YOUR TRACKER CALLS ←←←
router.post('/update-location', async (req, res) => {
  const { deviceId, lat, lng, battery = 100, accuracy } = req.body;

  if (!deviceId || !lat || !lng) {
    return res.status(400).json({ error: 'Missing deviceId, lat, or lng' });
  }

  try {
    const { error } = await supabaseAdmin
      .from('devices')
      .update({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        battery: parseInt(battery),
        last_updated: new Date().toISOString(),
        // accuracy: accuracy || null,   // optional
      })
      .eq('id', deviceId.toUpperCase());

    if (error) throw error;

    // Optional: broadcast realtime update (your React app already listens)
    console.log(`✅ Location updated for device ${deviceId}: ${lat}, ${lng}`);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;