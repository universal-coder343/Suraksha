import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.29.43:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (phone, password) => api.post('/auth/login', { phone, password });
export const register = (data) => api.post('/auth/register', data);
export const getContacts = () => api.get('/contacts');
export const addContact = (data) => api.post('/contacts', data);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);
export const getZones = (city = 'Jaipur') => api.get(`/zones?city=${city}`);
export const createSOS = (data) => api.post('/sos', data);
export const updateSOSLocation = (id, lat, lng) => api.patch(`/sos/${id}/location`, { lat, lng });
export const cancelSOS = (id) => api.patch(`/sos/${id}/cancel`);
export const getSafeRoute = (from, to, city = 'Jaipur') => 
  api.get(`/route?from=${from.lat},${from.lng}&to=${to.lat},${to.lng}&city=${city}`);

export default api;
