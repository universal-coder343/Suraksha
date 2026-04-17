import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, CircleMarker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getZones } from '../services/api';
import { getCurrentLocation } from '../services/locationService';

// Fix for default marker icons in Leaflet
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapAutoCenter = ({ coords, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    } else if (coords) {
      map.flyTo([coords.lat, coords.lng], 14, { animate: true });
    }
  }, [coords, bounds, map]);
  return null;
};

const MapComponent = ({ route }) => {
  const [zones, setZones] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const JAIPUR_CENTER = [26.9124, 75.7873];

  useEffect(() => {
    const init = async () => {
      try {
        const zoneRes = await getZones('Jaipur');
        setZones(zoneRes.data);
        
        const loc = await getCurrentLocation();
        setUserLoc(loc);
      } catch (err) {
        console.error('Map init failed', err);
      }
    };
    init();
  }, []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'red': return '#c0392b';
      case 'yellow': return '#f39c12';
      case 'green': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
      <MapContainer 
        center={JAIPUR_CENTER} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapAutoCenter 
          coords={userLoc} 
          bounds={route ? L.polyline(route.polyline).getBounds() : null} 
        />

        {zones.map((zone) => (
          <Polygon
            key={zone._id}
            positions={zone.polygon}
            pathOptions={{
              fillColor: getRiskColor(zone.risk),
              fillOpacity: 0.35,
              color: getRiskColor(zone.risk),
              weight: 2,
            }}
          >
            <Popup>
              <strong>{zone.name}</strong><br />
              Risk Level: {zone.risk.toUpperCase()}
            </Popup>
          </Polygon>
        ))}

        {route && (
          <Polyline 
            positions={route.polyline} 
            pathOptions={{ color: '#3498db', weight: 6, opacity: 0.8 }}
          >
            <Popup>
              <div style={{ minWidth: '150px' }}>
                <strong style={{ fontSize: '16px', color: 'var(--primary)' }}>Safest Route</strong>
                <hr style={{ margin: '8px 0', opacity: 0.2 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Safety Score:</span>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: route.safetyScore > 80 ? '#2ecc71' : route.safetyScore > 50 ? '#f39c12' : '#c0392b' 
                  }}>
                    {route.safetyScore}%
                  </span>
                </div>
                <div>Distance: <strong>{route.distance}</strong></div>
                <div>Duration: <strong>{route.duration}</strong></div>
                <div>Risk Areas: <strong>{route.zonesTraversed}</strong></div>
              </div>
            </Popup>
          </Polyline>
        )}

        {userLoc && (
          <CircleMarker
            center={[userLoc.lat, userLoc.lng]}
            pathOptions={{ color: '#3498db', fillColor: '#3498db', fillOpacity: 1 }}
            radius={8}
          >
            <Popup>Your Location</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
