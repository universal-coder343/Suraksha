import AlertCard from './AlertCard';

const AlertList = ({ alerts, loading, onTrack, onResolve }) => {
  if (loading) {
    return (
      <div className="p-6 flex-1 flex items-center justify-center">
        <div className="text-gray-400 animate-pulse text-lg">Loading Alerts...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          Active SOS
          <span className="ml-3 w-3 h-3 bg-red-500 rounded-full pulse-dot"></span>
        </h2>
        <span className="bg-red-900/50 text-red-500 text-sm py-1 px-3 rounded-full font-bold">
          {alerts.length} ACTIVE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
            <div className="w-16 h-16 border-2 border-gray-700 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-lg font-medium">All Clear</p>
            <p className="text-sm">No active SOS alerts in jurisdiction</p>
          </div>
        ) : (
          alerts.map(alert => (
            <AlertCard 
              key={alert._id} 
              alert={alert} 
              onTrack={onTrack} 
              onResolve={onResolve} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AlertList;
