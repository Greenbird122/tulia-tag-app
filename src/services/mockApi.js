// Simulated Backend API
const MOCK_DELAY = 500;
const simulateNetwork = (data) => new Promise(res => setTimeout(() => res(data), MOCK_DELAY));

// In-memory DB
let users = [];
let devices = [
  { id: 'TAG001', owner_id: 'user1', name: 'My Backpack', lat: -1.286389, lng: 36.817223, battery: 85, status: 'safe', lastUpdated: Date.now() },
  { id: 'TAG002', owner_id: 'user1', name: 'Gym Bag', lat: -1.292066, lng: 36.821945, battery: 42, status: 'safe', lastUpdated: Date.now() }
];
let sessions = [];
let reports = [];

// Simulate movement for lost devices
setInterval(() => {
  devices.forEach(d => {
    if (d.status === 'lost') {
      d.lat += (Math.random() - 0.5) * 0.0005;
      d.lng += (Math.random() - 0.5) * 0.0005;
      d.lastUpdated = Date.now();
    }
  });
}, 5000);

export const api = {
  login: async (email, password) => {
    return simulateNetwork({ token: 'mock-jwt-token', user: { id: 'user1', email, name: 'Alex' } });
  },
  register: async (name, email, password) => {
    return simulateNetwork({ token: 'mock-jwt-token', user: { id: 'user1', email, name } });
  },
  getDevices: async () => {
    return simulateNetwork(devices.filter(d => d.owner_id === 'user1'));
  },
  getLocation: async (deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    return simulateNetwork(device || null);
  },
  startLostMode: async (deviceId, durationHours) => {
    const code = `TULIA-${Math.floor(1000 + Math.random() * 9000)}`;
    const session = { id: Date.now().toString(), device_id: deviceId, code, expires: Date.now() + durationHours * 3600000, status: 'active' };
    sessions.push(session);
    
    const device = devices.find(d => d.id === deviceId);
    if(device) device.status = 'lost';
    
    return simulateNetwork({ code, session });
  },
  endLostMode: async (deviceId) => {
    const session = sessions.find(s => s.device_id === deviceId && s.status === 'active');
    if (session) session.status = 'ended';
    
    const device = devices.find(d => d.id === deviceId);
    if(device) device.status = 'safe';
    
    return simulateNetwork({ success: true });
  },
  getLostSession: async (code) => {
    const session = sessions.find(s => s.code === code && s.status === 'active');
    if (!session) throw new Error('Invalid or expired code');
    const device = devices.find(d => d.id === session.device_id);
    return simulateNetwork({ session, location: { lat: device.lat, lng: device.lng } });
  },
  reportSighting: async (sessionId, lat, lng, message) => {
    const report = { id: Date.now().toString(), session_id: sessionId, lat, lng, message, time: Date.now() };
    reports.push(report);
    // Force device location update based on helper
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      const device = devices.find(d => d.id === session.device_id);
      if (device) {
        device.lat = lat;
        device.lng = lng;
        device.lastUpdated = Date.now();
      }
    }
    return simulateNetwork({ success: true });
  },
  ringBuzzer: async (deviceId) => {
    return simulateNetwork({ success: true, message: 'Buzzer command queued' });
  },
  getHistory: async () => {
    return simulateNetwork(sessions);
  }
};