import { MapPin, Navigation, ShieldCheck } from 'lucide-react';

const formatTimeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
};

const AlertCard = ({ alert, onTrack, onResolve }) => {
  const isNew = Date.now() - new Date(alert.createdAt).getTime() < 10000;

  return (
    <div className={`bg-darkNavy border ${isNew ? 'border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'border-gray-700'} rounded-lg p-4 mb-3 relative overflow-hidden transition-all`}>
      {isNew && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 animate-pulse" />}
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-red-900/50 border border-red-500 flex items-center justify-center">
            <span className="text-red-500 font-bold text-lg">
              {alert.userName ? alert.userName.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{alert.userName || 'Unknown User'}</h3>
            <span className="text-xs text-red-400 font-semibold uppercase">{alert.triggerMethod} TRIGGER</span>
          </div>
        </div>
        <div className="text-gray-400 text-sm">{formatTimeAgo(alert.createdAt)}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mt-4">
        <div className="flex items-center space-x-2">
          <MapPin size={16} className="text-blue-400" />
          <span>{alert.liveLocation?.lat.toFixed(4)}, {alert.liveLocation?.lng.toFixed(4)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ShieldCheck size={16} className="text-yellow-400" />
          <span>Nearest PS: {alert.nearestPoliceStation?.name || 'Unknown'}</span>
        </div>
      </div>

      <div className="flex space-x-2 mt-4">
        <button 
          onClick={() => onTrack(alert.liveLocation)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex justify-center items-center font-medium transition-colors"
        >
          <Navigation size={16} className="mr-2" />
          Track
        </button>
        <button 
          onClick={() => onResolve(alert._id)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded flex justify-center items-center font-medium transition-colors"
        >
          <ShieldCheck size={16} className="mr-2" />
          Resolve
        </button>
      </div>
    </div>
  );
};

export default AlertCard;
