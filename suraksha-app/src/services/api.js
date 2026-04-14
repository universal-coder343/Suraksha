import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api'; 
// using Android emulator loopback IP: 10.0.2.2 to reach host machine

const api = axios.create({
  baseURL: API_URL
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      // Navigation should be handled by AuthContext state change naturally
    }
    return Promise.reject(error);
  }
);

export const login = (phone, password) => api.post('/auth/login', { phone, password });
export const register = (data) => api.post('/auth/register', data);
export const getContacts = () => api.get('/contacts');
export const addContact = (data) => api.post('/contacts', data);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);
export const getRoute = (fromLat, fromLng, toLat, toLng) => api.get(`/route?from=${fromLat},${fromLng}&to=${toLat},${toLng}`);
export const createSOS = (data) => api.post('/sos', data);
export const updateSOSLocation = (id, lat, lng) => api.patch(`/sos/${id}/location`, { lat, lng });
export const cancelSOS = (id) => api.patch(`/sos/${id}/cancel`);
export const getZones = (city = 'Bhopal') => api.get(`/zones?city=${city}`);

export default api;
