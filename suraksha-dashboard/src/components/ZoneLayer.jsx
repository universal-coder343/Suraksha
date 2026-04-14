import { Polygon, Tooltip } from 'react-leaflet';

const getRiskColor = (risk) => {
  switch(risk) {
    case 'red': return '#dc2626';     // high risk
    case 'yellow': return '#d97706';  // med risk
    case 'green': return '#16a34a';   // low risk
    default: return '#6b7280';
  }
};

const ZoneLayer = ({ zones }) => {
  if (!zones || zones.length === 0) return null;

  return (
    <>
      {zones.map((zone) => {
        const color = getRiskColor(zone.risk);
        return (
          <Polygon 
            key={zone._id}
            positions={zone.polygon}
            pathOptions={{ 
              color: color, 
              fillColor: color, 
              fillOpacity: 0.15,
              weight: 1 
            }}
          >
            <Tooltip sticky className="bg-darkNavy text-white border-0 text-xs">
              <strong>{zone.name}</strong><br/>
              Risk: <span className="uppercase">{zone.risk}</span>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
};

export default ZoneLayer;
