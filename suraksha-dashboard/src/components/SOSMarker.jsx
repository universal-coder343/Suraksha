import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { PhoneCall } from 'lucide-react';

const createPulseIcon = (initials) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="position: relative; width: 40px; height: 40px;">
        <div class="pulse-dot" style="position: absolute; top:0; left:0; width: 100%; height: 100%; background: rgba(220, 38, 38, 0.4); border-radius: 50%;"></div>
        <div style="position: absolute; top: 10px; left: 10px; width: 20px; height: 20px; background: #dc2626; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid white;">
          ${initials}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const SOSMarker = ({ alert }) => {
  const initials = alert.userName ? alert.userName.charAt(0).toUpperCase() : '?';
  const icon = createPulseIcon(initials);

  return (
    <Marker 
      position={[alert.liveLocation.lat, alert.liveLocation.lng]} 
      icon={icon}
    >
      <Popup className="custom-popup" closeButton={false}>
        <div className="bg-darkNavy text-white p-3 rounded shadow-xl w-64 border border-gray-700">
          <h3 className="font-bold text-lg border-b border-gray-700 pb-2 mb-2">{alert.userName}</h3>
          <div className="text-sm space-y-1 text-gray-300">
            <p><strong>Trigger:</strong> <span className="uppercase text-red-400">{alert.triggerMethod}</span></p>
            <p><strong>Phone:</strong> {alert.userPhone}</p>
            <p><strong>Time:</strong> {new Date(alert.createdAt).toLocaleTimeString()}</p>
            <p><strong>Coordinates:</strong> {alert.liveLocation.lat.toFixed(4)}, {alert.liveLocation.lng.toFixed(4)}</p>
          </div>
          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center py-2 rounded text-sm font-bold">
            <PhoneCall size={14} className="mr-2" />
            Dispatch Officer
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default SOSMarker;
