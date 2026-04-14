import { createSOS, updateSOSLocation, cancelSOS } from './api';
import { getCurrentLocation } from './locationService';

let trackingInterval = null;

export const triggerSOS = async (method = 'manual') => {
  try {
    const loc = await getCurrentLocation();
    if (!loc) throw new Error('Location unavailable');

    const res = await createSOS({
      lat: loc.lat,
      lng: loc.lng,
      triggerMethod: method
    });

    startLiveTracking(res.data._id);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const startLiveTracking = (sosId) => {
  if (trackingInterval) clearInterval(trackingInterval);
  
  trackingInterval = setInterval(async () => {
    try {
      const loc = await getCurrentLocation();
      if (loc) {
        await updateSOSLocation(sosId, loc.lat, loc.lng);
      }
    } catch (e) {
      console.error("Live tracking update failed", e);
    }
  }, 10000); // 10 seconds
};

export const stopLiveTracking = () => {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
};

export const cancelSOSAlert = async (sosId) => {
  try {
    stopLiveTracking();
    await cancelSOS(sosId);
  } catch (error) {
    throw error;
  }
};
