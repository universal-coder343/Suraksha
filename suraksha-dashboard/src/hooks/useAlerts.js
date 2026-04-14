import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getActiveAlerts } from '../api';

const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial active alerts
    getActiveAlerts().then((res) => {
      setAlerts(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      socket.emit('join_police_room');
    });

    socket.on('new_sos', (sosData) => {
      setAlerts((prev) => [sosData, ...prev]);
    });

    socket.on('sos_location_update', ({ sosId, location }) => {
      setAlerts((prev) => prev.map(a => 
        a._id === sosId ? { ...a, liveLocation: location } : a
      ));
    });

    socket.on('sos_resolved', ({ sosId }) => {
      setAlerts((prev) => prev.filter(a => a._id !== sosId));
    });

    socket.on('sos_cancelled', ({ sosId }) => {
      setAlerts((prev) => prev.filter(a => a._id !== sosId));
    });

    return () => socket.disconnect();
  }, []);

  return { alerts, loading };
};

export default useAlerts;
