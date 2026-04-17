import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createSOS, cancelSOS, updateSOSLocation } from '../services/api';
import { getCurrentLocation, watchLocation } from '../services/locationService';
import { AlertTriangle, X, Shield, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOSPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeSOS, setActiveSOS] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const watchId = useRef(null);
  const lastTap = useRef(0);

  useEffect(() => {
    getCurrentLocation().then(setLocation);
  }, []);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      triggerSOS();
    }
    lastTap.current = now;
  };

  const triggerSOS = async () => {
    if (activeSOS || loading) return;
    setLoading(true);
    try {
      const loc = await getCurrentLocation();
      const res = await createSOS({
        lat: loc.lat,
        lng: loc.lng,
        triggerMethod: 'double_tap'
      });
      setActiveSOS(res.data);
      startTracking(res.data._id);
    } catch (err) {
      alert('Failed to trigger SOS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startTracking = (sosId) => {
    watchId.current = watchLocation((loc) => {
      setLocation(loc);
      updateSOSLocation(sosId, loc.lat, loc.lng).catch(console.error);
    });
  };

  const stopSOS = async () => {
    if (!activeSOS) return;
    try {
      await cancelSOS(activeSOS._id);
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
      setActiveSOS(null);
      navigate('/map');
    } catch (err) {
      alert('Could not cancel SOS.');
    }
  };

  return (
    <div className="sos-container" style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      background: activeSOS ? '#1a0a0a' : 'var(--bg-dark)'
    }}>
      <AnimatePresence>
        {!activeSOS ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Safety Trigger</h1>
            <p style={{ color: 'var(--text-dim)', marginBottom: '40px' }}>Double tap the shield to activate SOS</p>
            
            <div 
              onClick={handleDoubleTap}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'var(--bg-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid var(--primary)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <Shield size={80} color="var(--primary)" />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}
          >
            <div className="sos-pulse" style={{
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 40px'
            }}>
              <AlertTriangle size={60} color="white" />
            </div>

            <div className="glass-card" style={{ padding: '24px', textAlign: 'left', marginBottom: '40px' }}>
              <h2 style={{ color: 'var(--primary)', marginBottom: '16px' }}>SOS ACTIVE</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <MapPin size={16} color="var(--text-dim)" />
                <span style={{ fontSize: '14px' }}>
                  {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Locating...'}
                </span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-dim)' }}>
                Police and trusted contacts have been notified of your live location.
              </p>
            </div>

            <button 
              className="btn-primary" 
              onClick={stopSOS}
              style={{ width: '100%', backgroundColor: '#333', boxShadow: 'none' }}
            >
              CANCEL ALERT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SOSPage;
