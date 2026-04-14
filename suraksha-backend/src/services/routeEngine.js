const { Client } = require('@googlemaps/google-maps-services-js');
const polyline = require('@mapbox/polyline');

const googleMapsClient = new Client({});

// Point in polygon Ray Casting algorithm
const isPointInPolygon = (point, polygon) => {
  let [lat, lng] = point;
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let [yi, xi] = polygon[i];
    let [yj, xj] = polygon[j];
    
    let intersect = ((yi > lat) !== (yj > lat)) &&
        (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }
  return isInside;
};

const getSafeRoute = async (originLat, originLng, destLat, destLng, zones) => {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    // Mock return if no key
    console.log("Mock routing: No Google Maps API Key");
    return {
      polyline: [[originLat, originLng], [destLat, destLng]],
      distance: "Mock km",
      duration: "Mock min",
      zonesAvoided: 0,
      riskScore: 0,
      via: "Direct Mock Route"
    };
  }

  try {
    const response = await googleMapsClient.directions({
      params: {
        origin: `${originLat},${originLng}`,
        destination: `${destLat},${destLng}`,
        alternatives: true,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    const routes = response.data.routes;
    if (!routes || routes.length === 0) {
      throw new Error("No routes found");
    }

    let bestRoute = null;
    let minRiskScore = Infinity;

    for (const route of routes) {
      const decodedPolyline = polyline.decode(route.overview_polyline.points);
      let riskScore = 0;
      let zonesAvoided = 0;

      // Score points
      for (const point of decodedPolyline) {
        for (const zone of zones) {
          if (isPointInPolygon(point, zone.polygon)) {
            if (zone.risk === 'red') riskScore += 10;
            else if (zone.risk === 'yellow') riskScore += 3;
            else if (zone.risk === 'green') riskScore += 0;
          }
        }
      }

      if (riskScore < minRiskScore) {
        minRiskScore = riskScore;
        bestRoute = {
          polyline: decodedPolyline,
          distance: route.legs[0].distance.text,
          duration: route.legs[0].duration.text,
          zonesAvoided: zonesAvoided, // naive counter
          riskScore,
          via: route.summary
        };
      }
    }

    return bestRoute;

  } catch (error) {
    console.error("Error fetching directions:", error);
    throw error;
  }
};

module.exports = {
  getSafeRoute,
  isPointInPolygon
};
