import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, setAuthToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          setAuthToken(token);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (phone, password) => {
    try {
      const res = await apiLogin(phone, password);
      const userData = res.data;
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', userData.token);
      setAuthToken(userData.token);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
