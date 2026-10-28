import React, { useState, useEffect } from 'react';
import { useRoute } from '../context/RouteContext';
import { useSafety } from '../context/SafetyContext';
import NavigationHUD from '../components/navigation/NavigationHUD';
import HazardAlertBanner from '../components/navigation/HazardAlertBanner';
import DeviationAlert from '../components/navigation/DeviationAlert';
import MapView from '../components/map/MapView';
import { ShieldAlert, ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

export const LiveNavigationPage = ({ onRouteChange }) => {
  const { selectedRoute } = useRoute();
  const {
    currentLocation,
    activeHazards,
    isSOSActive,
    triggerSOS,
    cancelSOS
  } = useSafety();

  // Simulated vehicle step progression along the route coordinates
  const coordinates = selectedRoute?.coordinates || [
    [28.6315, 77.2167],
    [28.6250, 77.2185],
    [28.6120, 77.2110],
    [28.5950, 77.2090],
    [28.5800, 77.2150],
    [28.5670, 77.2080],
    [28.5450, 77.2060],
    [28.5280, 77.2050]
  ];

  const steps = selectedRoute?.steps || [
    { id: 1, instruction: "Head south on Radial Road 1 toward Janpath", distance: "400 m", turn: "straight" },
    { id: 2, instruction: "Continue straight on Janpath Road (Well-lit)", distance: "1.2 km", turn: "straight" },
    { id: 3, instruction: "Turn slight right onto Aurobindo Marg", distance: "3.5 km", turn: "right" },
    { id: 4, instruction: "Pass AIIMS 24/7 Police Checkpost (Safe Haven)", distance: "2.1 km", turn: "straight" },
    { id: 5, instruction: "Arrive at Saket District Centre destination", distance: "200 m", turn: "destination" }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto advance vehicle along route steps
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % coordinates.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, coordinates.length]);

  const vehiclePosition = coordinates[currentStepIndex] || coordinates[0];
  const activeStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  const remainingKm = Math.max(0.4, (selectedRoute?.distanceKm || 14.2) * (1 - currentStepIndex / coordinates.length)).toFixed(1);
  const remainingMins = Math.max(1, Math.round((selectedRoute?.etaMinutes || 32) * (1 - currentStepIndex / coordinates.length)));
  const progressPercent = Math.round((currentStepIndex / (coordinates.length - 1)) * 100);

  return (
    <div className="space-y-4 relative">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onRouteChange('routes')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Navigation</span>
        </button>

        {/* Demo Simulation Player Controls */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400">Simulation:</span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded-lg text-blue-600 hover:bg-blue-50 font-bold text-xs flex items-center gap-1"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={() => setCurrentStepIndex(0)}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
            title="Reset to origin"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Minimalist Navigation HUD Banner */}
      <NavigationHUD
        currentStep={activeStep}
        remainingDistanceKm={remainingKm}
        remainingMinutes={remainingMins}
        speedKmh={isPlaying ? 38 : 0}
        progressPercent={progressPercent}
        onExitNavigation={() => onRouteChange('routes')}
      />

      {/* Dynamic Hazard Alert Area */}
      <HazardAlertBanner hazards={activeHazards} />

      {/* Deviation & Rerouting Box */}
      <DeviationAlert />

      {/* Full Map Canvas with Moving Vehicle Marker */}
      <div className="relative">
        <MapView
          routes={[selectedRoute]}
          selectedRouteId={selectedRoute?.id}
          showAllRoutes={false}
          vehiclePosition={vehiclePosition}
          height="420px"
        />

        {/* Floating Quick-SOS Button Visible at All Times */}
        <button
          onClick={() => (isSOSActive ? cancelSOS() : triggerSOS())}
          className={`absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-[1000] p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider text-white transition-all transform hover:scale-105 active:scale-95 ${
            isSOSActive
              ? 'bg-red-600 ring-4 ring-red-400 animate-pulse'
              : 'bg-red-600 hover:bg-red-700 shadow-red-600/40'
          }`}
        >
          <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
          <span>{isSOSActive ? 'Disarm SOS' : 'Instant SOS'}</span>
        </button>
      </div>
    </div>
  );
};

export default LiveNavigationPage;
