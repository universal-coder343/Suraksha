import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('policeToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (phone, password) => api.post('/auth/login', { phone, password });
export const getActiveAlerts = () => api.get('/sos?status=active');
export const resolveAlert = (id) => api.patch(`/sos/${id}/resolve`);
export const getZones = () => api.get('/zones?city=Bhopal');
export const getStats = () => api.get('/stats');

export default api;
