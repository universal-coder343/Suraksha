import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';
import { Shield, Navigation, Settings, Users, AlertTriangle, Search, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGeocode, getCurrentLocation } from '../services/locationService';
import { getSafeRoute } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const MapPage = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);

  const handleSearch = async (e) => {
    if (e.key !== 'Enter' || !destination.trim()) return;
    
    setIsLoading(true);
    setRouteData(null);
    try {
      // 1. Get current location
      const currentLoc = await getCurrentLocation();
      
      // 2. Geocode destination
      const destLoc = await getGeocode(destination);
      
      // 3. Get safe route from backend
      const res = await getSafeRoute(currentLoc, destLoc);
      setRouteData(res.data);
    } catch (err) {
      console.error('Routing failed', err);
      alert('Could not find a safe route to that location.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header Search */}
      <div style={{ 
        position: 'absolute', top: '20px', left: '20px', right: '20px', 
        zIndex: 1000, 
        pointerEvents: 'none' 
      }}>
        <div className="glass-card" style={{ 
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          gap: '12px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <Search size={20} color="var(--text-dim)" />
          <input 
            type="text" 
            placeholder="Search destination in Jaipur..." 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={handleSearch}
            disabled={isLoading}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              flex: 1, 
              fontSize: '16px',
              outline: 'none',
              opacity: isLoading ? 0.5 : 1
            }}
          />
          {isLoading && <Loader2 className="animate-spin" size={20} color="var(--primary)" />}
        </div>
      </div>

      {/* Route Summary Overly */}
      <AnimatePresence>
        {routeData && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            style={{ 
              position: 'absolute', top: '85px', left: '20px', right: '20px', 
              zIndex: 1500,
              maxWidth: '500px',
              margin: '0 auto'
            }}
          >
            <div className="glass-card" style={{ padding: '16px', border: '1px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={20} color="var(--primary)" />
                  <span style={{ fontWeight: 'bold' }}>SAFE ROUTE FOUND</span>
                </div>
                <button 
                  onClick={() => setRouteData(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="stat-item">
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>ROUTE STATUS</span>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    color: routeData.safetyScore === 100 ? '#2ecc71' : routeData.safetyScore === 60 ? '#f39c12' : '#e74c3c',
                    marginTop: '4px'
                  }}>
                    {routeData.safetyLabel || (routeData.safetyScore === 100 ? '✅ All Safe' : routeData.safetyScore >= 60 ? '⚠️ Some Caution' : '🚨 Has Danger Areas')}
                  </div>
                </div>
                <div className="stat-item">
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>EST. TIME</span>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{routeData.duration}</div>
                </div>
              </div>

              <div style={{ 
                marginTop: '12px', 
                fontSize: '12px', 
                color: 'var(--text-dim)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px' 
              }}>
                <Navigation size={12} />
                <span>{routeData.via} • {routeData.distance}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ flex: 1, position: 'relative' }}>
        <MapComponent route={routeData} />
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/sos')}
        className="sos-pulse"
        style={{
          position: 'absolute',
          bottom: '100px',
          right: '30px',
          width: '70px',
          height: '70px',
          borderRadius: '35px',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          boxShadow: '0 8px 30px var(--primary-glow)',
          zIndex: 1000,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <AlertTriangle size={32} />
      </button>

      {/* Bottom Navigation */}
      <div className="glass-card" style={{ 
        borderRadius: '24px 24px 0 0',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 2000,
        height: '80px'
      }}>
        <NavItem icon={<Navigation size={24} />} label="Explore" active />
        <NavItem icon={<Users size={24} />} label="Contacts" onClick={() => navigate('/contacts')} />
        <NavItem icon={<Shield size={24} />} label="Safety" onClick={() => navigate('/sos')} />
        <NavItem icon={<Settings size={24} />} label="Profile" />
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '4px',
      color: active ? 'var(--primary)' : 'var(--text-dim)',
      cursor: 'pointer'
    }}
  >
    {icon}
    <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{label.toUpperCase()}</span>
  </div>
);

export default MapPage;
