const PoliceStation = require('../models/PoliceStation');

// Helper for Haversine distance
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const p = Math.PI / 180;
  const a = 0.5 - Math.cos((lat2 - lat1) * p)/2 + 
            Math.cos(lat1 * p) * Math.cos(lat2 * p) * 
            (1 - Math.cos((lon2 - lon1) * p))/2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

const getNearestPoliceStation = async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    if (!lat || !lng) {
      return res.status(400).json({ message: 'lat and lng required' });
    }

    const stations = await PoliceStation.find();
    if (stations.length === 0) {
      return res.status(404).json({ message: 'No police stations found' });
    }

    let nearest = stations[0];
    let minDistance = getDistance(lat, lng, nearest.location.lat, nearest.location.lng);

    for (let i = 1; i < stations.length; i++) {
      const dist = getDistance(lat, lng, stations[i].location.lat, stations[i].location.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = stations[i];
      }
    }

    res.json({
      station: nearest,
      distanceKm: minDistance.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNearestPoliceStation
};
