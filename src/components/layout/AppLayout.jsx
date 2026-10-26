import React from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { useSafety } from '../../context/SafetyContext';

export const AppLayout = ({ children, currentRoute, onRouteChange }) => {
  const { isSOSActive } = useSafety();

  return (
    <div className={`min-h-screen flex bg-slate-50 relative overflow-x-hidden ${isSOSActive ? 'screen-emergency-active' : ''}`}>
      {/* Left Sidebar */}
      <Sidebar currentRoute={currentRoute} onRouteChange={onRouteChange} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <TopHeader onRouteChange={onRouteChange} />
        
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Fullscreen emergency warning banner when SOS is active */}
      {isSOSActive && (
        <div className="fixed bottom-4 right-6 z-50 bg-red-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border-2 border-white">
          <div className="w-3 h-3 rounded-full bg-white animate-ping" />
          <span className="font-bold text-sm tracking-wide">
            🚨 ACTIVE SOS BROADCAST: Live telemetry sent to Police & Contacts
          </span>
          <button
            onClick={() => onRouteChange('sos')}
            className="ml-2 bg-white text-red-600 px-3 py-1 rounded-lg text-xs font-black uppercase hover:bg-red-50"
          >
            Manage
          </button>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
