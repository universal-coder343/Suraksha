import { useEffect, useState } from 'react';
import { getStats } from '../api';
import { Activity, CheckCircle, Clock, Map } from 'lucide-react';

const StatsBar = () => {
  const [stats, setStats] = useState({
    activeAlerts: 0,
    resolvedToday: 0,
    avgResponseTimeMinutes: 0,
    citiesCovered: 0
  });

  useEffect(() => {
    // Initial fetch
    getStats().then(res => setStats(res.data)).catch(console.error);
    
    // Poll every 1 minute
    const interval = setInterval(() => {
      getStats().then(res => setStats(res.data)).catch(console.error);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-[1px] bg-gray-700 border-b border-gray-700">
      <div className="bg-policeBlue p-4 flex flex-col justify-center">
        <div className="flex items-center text-gray-400 text-xs font-bold mb-1">
          <Activity size={12} className="mr-1 text-red-500" /> ACTIVE
        </div>
        <div className="text-2xl font-bold text-white">{stats.activeAlerts}</div>
      </div>
      
      <div className="bg-policeBlue p-4 flex flex-col justify-center">
        <div className="flex items-center text-gray-400 text-xs font-bold mb-1">
          <CheckCircle size={12} className="mr-1 text-green-500" /> RESOLVED TODAY
        </div>
        <div className="text-2xl font-bold text-white">{stats.resolvedToday}</div>
      </div>

      <div className="bg-policeBlue p-4 flex flex-col justify-center">
        <div className="flex items-center text-gray-400 text-xs font-bold mb-1">
          <Clock size={12} className="mr-1 text-blue-400" /> AVG RESPONSE
        </div>
        <div className="text-2xl font-bold text-white">{stats.avgResponseTimeMinutes} m</div>
      </div>

      <div className="bg-policeBlue p-4 flex flex-col justify-center">
        <div className="flex items-center text-gray-400 text-xs font-bold mb-1">
          <Map size={12} className="mr-1 text-purple-400" /> CITIES
        </div>
        <div className="text-2xl font-bold text-white">{stats.citiesCovered}</div>
      </div>
    </div>
  );
};

export default StatsBar;
