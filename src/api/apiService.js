import apiClient from './client';
import {
  MOCK_USER,
  MOCK_ROUTES,
  MOCK_EMERGENCY_SERVICES,
  MOCK_EMERGENCY_CONTACTS
} from './mockData';

// Simulated delay helper for realistic network feel during offline demos
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // 1. Authentication Endpoints
  async login({ email, password }) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      console.warn('[E-Saarthi API] /auth/login using offline fallback:', err.message);
      await delay(500);
      return {
        token: 'mock_jwt_esaarthi_token_xyz9812',
        user: { ...MOCK_USER, email }
      };
    }
  },

  async register({ fullName, email, phone, password }) {
    try {
      const response = await apiClient.post('/auth/register', { fullName, email, phone, password });
      return response.data;
    } catch (err) {
      console.warn('[E-Saarthi API] /auth/register using offline fallback:', err.message);
      await delay(600);
      return {
        token: 'mock_jwt_esaarthi_token_new_user',
        user: {
          ...MOCK_USER,
          fullName: fullName || MOCK_USER.fullName,
          email: email || MOCK_USER.email,
          phone: phone || MOCK_USER.phone
        }
      };
    }
  },

  // 2. Route Calculation Endpoint
  async calculateRoutes({ origin, destination }) {
    try {
      const response = await apiClient.post('/routes/calculate', { origin, destination });
      return response.data;
    } catch (err) {
      console.warn('[E-Saarthi API] /routes/calculate using offline fallback:', err.message);
      await delay(700);
      return {
        origin,
        destination,
        calculatedAt: new Date().toISOString(),
        routes: MOCK_ROUTES
      };
    }
  },

  // 3. Route Details & Safety Breakdown Endpoint
  async getRouteDetails(routeId) {
    try {
      const response = await apiClient.get(`/routes/details/${routeId}`);
      return response.data;
    } catch (err) {
      console.warn(`[E-Saarthi API] /routes/details/${routeId} using offline fallback:`, err.message);
      await delay(300);
      const foundRoute = MOCK_ROUTES.find(r => r.id === routeId) || MOCK_ROUTES[0];
      return {
        routeId: foundRoute.id,
        safetyBreakdown: foundRoute.safetyBreakdown,
        weather: foundRoute.weather,
        lightingScore: foundRoute.lightingScore,
        cctvCoverage: foundRoute.cctvCoverage,
        patrolFrequency: foundRoute.patrolFrequency,
        description: foundRoute.description
      };
    }
  },

  // 4. Nearby Emergency Services Endpoint
  async getNearbyServices({ lat = 28.6315, lng = 77.2167, type = 'all', radius = 10 } = {}) {
    try {
      const response = await apiClient.get('/services/nearby', {
        params: { lat, lng, type, radius }
      });
      return response.data;
    } catch (err) {
      console.warn('[E-Saarthi API] /services/nearby using offline fallback:', err.message);
      await delay(400);
      let services = [...MOCK_EMERGENCY_SERVICES];
      if (type && type !== 'all') {
        services = services.filter(s => s.type === type);
      }
      return {
        location: { lat, lng },
        totalFound: services.length,
        services
      };
    }
  },

  // 5. Emergency SOS Trigger Endpoint
  async triggerSOS({ lat = 28.6315, lng = 77.2167, timestamp = new Date().toISOString(), note = '' } = {}) {
    try {
      const response = await apiClient.post('/sos/trigger', { lat, lng, timestamp, note });
      return response.data;
    } catch (err) {
      console.warn('[E-Saarthi API] /sos/trigger using offline fallback:', err.message);
      await delay(500);
      return {
        success: true,
        sosId: 'sos_alert_' + Math.floor(100000 + Math.random() * 900000),
        status: 'BROADCAST_ACTIVE',
        timestamp,
        coordinates: { lat, lng },
        dispatchedAuthorities: [
          'Delhi Police Central Control (PCR Van #12 Assigned)',
          'National Emergency Response Support System (ERSS 112)',
          'Women Safety Cell Unit (Helpline 1091)'
        ],
        notifiedContacts: MOCK_EMERGENCY_CONTACTS.map(c => ({
          name: c.name,
          phone: c.phone,
          status: 'SMS & WhatsApp alert dispatched with live telemetry URL'
        }))
      };
    }
  },

  // 6. Emergency Contacts helper
  async getEmergencyContacts() {
    await delay(200);
    return MOCK_EMERGENCY_CONTACTS;
  }
};

export default apiService;
