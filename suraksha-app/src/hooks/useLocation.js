import { useState, useEffect } from 'react';
import { getCurrentLocation, watchLocation } from '../services/locationService';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let subscriber;
    
    const initLoc = async () => {
      try {
        const loc = await getCurrentLocation();
        if (loc) setLocation(loc);
        else setErrorMsg('Could not get initial location');

        subscriber = await watchLocation((newLoc) => {
          setLocation(newLoc);
        });
      } catch (e) {
        setErrorMsg(e.message);
      }
    };

    initLoc();

    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, []);

  return { location, errorMsg };
};
