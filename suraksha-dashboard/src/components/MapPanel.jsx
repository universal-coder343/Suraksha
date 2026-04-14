import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import SOSMarker from './SOSMarker';
import ZoneLayer from './ZoneLayer';
import useZones from '../hooks/useZones';

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 16, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

const MapPanel = ({ alerts, focusLocation }) => {
  const { zones } = useZones();
  const BHOPAL_CENTER = [23.2599, 77.4126];

  return (
    <div className="h-full w-full relative bg-darkNavy">
      <MapContainer 
        center={BHOPAL_CENTER} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#0d1b2a' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {focusLocation && <MapUpdater center={focusLocation} />}
        
        <ZoneLayer zones={zones} />

        {alerts.map(alert => (
          alert.liveLocation && (
            <SOSMarker key={alert._id} alert={alert} />
          )
        ))}
      </MapContainer>
      
      {/* Overlay controls could go here */}
    </div>
  );
};

export default MapPanel;
