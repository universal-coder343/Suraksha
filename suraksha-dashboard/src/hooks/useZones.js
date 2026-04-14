import { useState, useEffect } from 'react';
import { getZones } from '../api';

const useZones = () => {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    getZones().then(res => setZones(res.data)).catch(console.error);
  }, []);

  return { zones };
};

export default useZones;
