import { useState } from 'react';
import useAlerts from '../hooks/useAlerts';
import AlertList from '../components/AlertList';
import MapPanel from '../components/MapPanel';
import StatsBar from '../components/StatsBar';
import { resolveAlert } from '../api';
import { LogOut } from 'lucide-react';

const Dashboard = ({ onLogout }) => {
  const { alerts, loading } = useAlerts();
  const [selectedLocation, setSelectedLocation] = useState(null); // {lat, lng} to fly Map to

  const handleTrack = (location) => {
    setSelectedLocation(location);
  };

  const handleResolve = async (id) => {
    if (window.confirm('Mark this alert as resolved?')) {
      try {
        await resolveAlert(id);
      } catch (err) {
        alert('Failed to resolve');
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-darkNavy overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-gray-700 flex items-center justify-between px-6 bg-policeBlue">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <h1 className="text-xl font-bold tracking-wider text-white">SURAKSHA COMMAND</h1>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <LogOut size={20} className="mr-2" />
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-[420px] flex flex-col border-r border-gray-700 bg-policeBlue z-10">
          <StatsBar />
          <AlertList 
            alerts={alerts} 
            loading={loading} 
            onTrack={handleTrack} 
            onResolve={handleResolve} 
          />
        </div>

        {/* Right Panel (Map) */}
        <div className="flex-1 relative z-0">
          <MapPanel alerts={alerts} focusLocation={selectedLocation} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
