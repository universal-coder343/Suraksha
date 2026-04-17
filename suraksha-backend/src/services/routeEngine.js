const axios = require('axios');
const polyline = require('@mapbox/polyline');

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

const getPolygonCenter = (polygon) => {
  let latSum = 0, lngSum = 0;
  polygon.forEach(p => { latSum += p[0]; lngSum += p[1]; });
  return [latSum / polygon.length, lngSum / polygon.length];
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
    // 1. Initial Attempt: Fetch Regular Driving and Walking Routes
    const drivingUrl = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&alternatives=3&geometries=polyline`;
    const walkingUrl = `https://router.project-osrm.org/route/v1/walking/${originLng},${originLat};${destLng},${destLat}?overview=full&alternatives=3&geometries=polyline`;

    const [drivingRes, walkingRes] = await Promise.all([
      axios.get(drivingUrl).catch(() => ({ data: { routes: [] } })),
      axios.get(walkingUrl).catch(() => ({ data: { routes: [] } }))
    ]);

    let candidateRoutes = [
      ...drivingRes.data.routes.map(r => ({ ...r, profile: 'driving' })),
      ...walkingRes.data.routes.map(r => ({ ...r, profile: 'walking' }))
    ];

    // 2. Proactive "Safe Haven" Detour:
    // Try to find a detour via each Green Zone center to significantly expand our options
    const greenZones = zones.filter(z => z.risk === 'green');
    if (greenZones.length > 0) {
      console.log(`[Safety Engine] Proactively searching for Safe Haven Waypoints...`);
      
      const detourPromises = greenZones.slice(0, 3).map(zone => {
        const center = getPolygonCenter(zone.polygon);
        const waypointedUrl = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${center[1]},${center[0]};${destLng},${destLat}?overview=full&geometries=polyline`;
        return axios.get(waypointedUrl)
          .then(res => res.data.routes.map(r => ({ ...r, profile: `waypoint-${zone.name}` })))
          .catch(() => []);
      });

      const detourResults = await Promise.all(detourPromises);
      candidateRoutes = [...candidateRoutes, ...detourResults.flat()];
    }

    if (candidateRoutes.length === 0) {
      throw new Error("No routes found from any profile.");
    }

    let bestRoute = null;
    let bestScore = null;

    console.log(`[Safety Engine] Analyzing ${candidateRoutes.length} route options...`);

    for (let i = 0; i < candidateRoutes.length; i++) {
      const route = candidateRoutes[i];
      const decodedPolyline = polyline.decode(route.geometry);

      let redPoints = 0;
      let yellowPoints = 0;
      let zonesEntered = new Set();

      // Count how many polyline points fall in each zone type
      for (const point of decodedPolyline) {
        for (const zone of zones) {
          if (isPointInPolygon(point, zone.polygon)) {
            if (zone.risk === 'red') redPoints++;
            else if (zone.risk === 'yellow') yellowPoints++;
            zonesEntered.add(zone._id.toString());
          }
        }
      }

      const distKm = route.distance / 1000;

      // Simple tiered score object: compare red first, then yellow, then distance
      const score = { redPoints, yellowPoints, distKm };

      console.log(`  > Opt ${i} [${route.profile}]: Red=${redPoints}, Yellow=${yellowPoints}, Dist=${distKm.toFixed(1)}km`);

      // Pick this route if it's safer (Green > Yellow > Red priority)
      const isBetter = !bestScore ||
        score.redPoints < bestScore.redPoints ||
        (score.redPoints === bestScore.redPoints && score.yellowPoints < bestScore.yellowPoints) ||
        (score.redPoints === bestScore.redPoints && score.yellowPoints === bestScore.yellowPoints && score.distKm < bestScore.distKm);

      if (isBetter) {
        bestScore = score;

        // Safety label: all green = Safe, some yellow = Caution, any red = Warning
        const safetyLabel = redPoints === 0 && yellowPoints === 0
          ? '✅ All Safe'
          : redPoints === 0
          ? '⚠️ Some Caution Areas'
          : '🚨 Danger Areas on Route';

        const distLabel = distKm.toFixed(1);
        const durMin = Math.round(route.duration / 60);

        bestRoute = {
          polyline: decodedPolyline,
          distance: `${distLabel} km`,
          duration: `${durMin} min`,
          zonesAvoided: zones.length - zonesEntered.size,
          zonesTraversed: zonesEntered.size,
          riskScore: redPoints * 1000 + yellowPoints * 100,
          safetyScore: redPoints === 0 && yellowPoints === 0 ? 100 : redPoints === 0 ? 60 : 20,
          safetyLabel,
          via: route.profile.startsWith('waypoint')
            ? `Detour via ${route.profile.replace('waypoint-', '')}`
            : `${route.profile === 'walking' ? 'Side-street' : 'Main Road'} Route`
        };
      }
    }

    console.log(`[Safety Engine] Best Route: ${bestRoute.via} | Red=${bestScore.redPoints}, Yellow=${bestScore.yellowPoints}, Dist=${bestScore.distKm.toFixed(1)}km`);
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
