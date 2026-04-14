// Simple point in polygon logic
export const isPointInZone = (lat, lng, polygon) => {
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let yi = polygon[i].latitude;
    let xi = polygon[i].longitude;
    let yj = polygon[j].latitude;
    let xj = polygon[j].longitude;
    
    let intersect = ((yi > lat) !== (yj > lat)) &&
        (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }
  return isInside;
};

export const getZoneRisk = (lat, lng, zones) => {
  for (const zone of zones) {
    if (isPointInZone(lat, lng, zone.coordinates)) {
      return getNightRisk(zone.risk); // apply time modifier
    }
  }
  return 'safe';
};

export const getNightRisk = (baseRisk) => {
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 21 || currentHour < 5; // 9 PM to 5 AM

  if (!isNight) return baseRisk;

  // Escalate risks at night
  if (baseRisk === 'green') return 'yellow';
  if (baseRisk === 'yellow') return 'red';
  return baseRisk; // red stays red
};
