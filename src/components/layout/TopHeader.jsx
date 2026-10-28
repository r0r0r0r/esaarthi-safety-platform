import React from 'react';
import {
  ShieldAlert,
  Radio,
  Bell,
  Sparkles,
  PhoneCall,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSafety } from '../../context/SafetyContext';

export const TopHeader = ({ onRouteChange }) => {
  const { user } = useAuth();
  const {
    isSOSActive,
    isLocationSharingActive,
    toggleLocationSharing,
    currentLocation
  } = useSafety();

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.fullName?.split(' ')[0] || 'Priya';
  const safetyScore = user?.safetyScore || 78;

  return (
    <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 transition-all">
      {/* Left: Greeting & Current Location */}
      <div className="flex items-center gap-4">
        {user?.avatarUrl && (
          <img
            src={user.avatarUrl}
            alt={user.fullName || 'User'}
            onClick={() => onRouteChange('profile')}
            className="w-11 h-11 rounded-2xl object-cover border-2 border-slate-200 shadow-md cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
            title="View Profile"
          />
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              {getGreeting()}, {firstName}!
            </h2>
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium text-slate-700">{currentLocation.name}</span>
            <span className="text-slate-400">• High Confidence GPS (±{currentLocation.accuracy}m)</span>
          </div>
        </div>
      </div>

      {/* Right Badges & Quick Action Controls */}
      <div className="flex items-center gap-3">
        {/* Safety Score Badge */}
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs font-semibold">
            Safety Score: <span className="font-extrabold text-emerald-900">{safetyScore}/100</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200/60 text-emerald-900 px-1.5 py-0.5 rounded-md">
            Good
          </span>
        </div>

        {/* Live Location Sharing Toggle */}
        <button
          onClick={toggleLocationSharing}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            isLocationSharingActive
              ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm hover:bg-blue-100'
              : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
          }`}
          title={isLocationSharingActive ? "Live GPS broadcast active to emergency cloud" : "Location sharing paused"}
        >
          <Radio
            className={`w-3.5 h-3.5 ${
              isLocationSharingActive ? 'text-blue-600 animate-pulse' : 'text-slate-400'
            }`}
          />
          <span>Location: {isLocationSharingActive ? 'Sharing On' : 'Paused'}</span>
          <div
            className={`w-2 h-2 rounded-full ${
              isLocationSharingActive ? 'bg-blue-600' : 'bg-slate-400'
            }`}
          />
        </button>

        {/* Active SOS Status / Trigger Button */}
        {isSOSActive ? (
          <button
            onClick={() => onRouteChange('sos')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-500/40 animate-pulse-fast hover:bg-red-700 transition-all"
          >
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>SOS Active • View</span>
          </button>
        ) : (
          <button
            onClick={() => onRouteChange('sos')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white font-bold text-xs transition-all shadow-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden sm:inline">Emergency SOS</span>
          </button>
        )}

        {/* National Helpline 112 Direct Quick Link */}
        <a
          href="tel:112"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold border border-slate-200 transition-all"
          title="Direct call to National Emergency 112"
        >
          <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
          <span>Call 112</span>
        </a>
      </div>
    </header>
  );
};

export default TopHeader;
