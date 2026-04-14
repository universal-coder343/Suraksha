import { getRoute } from './api';

export const fetchSafeRoute = async (origin, dest) => {
  try {
    const res = await getRoute(origin.lat, origin.lng, dest.lat, dest.lng);
    return res.data;
  } catch (error) {
    throw error;
  }
};
