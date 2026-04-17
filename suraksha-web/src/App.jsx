import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import MapPage from './pages/MapPage';
import SOSPage from './pages/SOSPage';
import ContactsPage from './pages/ContactsPage';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  
  if (isLoading) return <div style={{ background: '#0a0e14', height: '100vh' }} />;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/map" 
            element={
              <PrivateRoute>
                <MapPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/sos" 
            element={
              <PrivateRoute>
                <SOSPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/contacts" 
            element={
              <PrivateRoute>
                <ContactsPage />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/map" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
