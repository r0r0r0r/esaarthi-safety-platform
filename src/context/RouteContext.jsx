import React, { createContext, useContext, useState, useMemo } from 'react';
import apiService from '../api/apiService';
import { MOCK_ROUTES } from '../api/mockData';

const RouteContext = createContext(null);

export const RouteProvider = ({ children }) => {
  const [origin, setOrigin] = useState("Connaught Place, Central Delhi");
  const [destination, setDestination] = useState("Saket District Centre, South Delhi");
  const [routes, setRoutes] = useState(MOCK_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState("rt_safe_01");
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeModalRoute, setActiveModalRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active selected route object
  const selectedRoute = useMemo(() => {
    return routes.find(r => r.id === selectedRouteId) || routes[0];
  }, [routes, selectedRouteId]);

  const calculateRoutes = async (sourceLoc, destLoc) => {
    const src = sourceLoc || origin;
    const dst = destLoc || destination;
    setIsCalculating(true);
    try {
      const result = await apiService.calculateRoutes({ origin: src, destination: dst });
      if (result && result.routes && result.routes.length > 0) {
        setRoutes(result.routes);
        setSelectedRouteId(result.routes[0].id);
      }
      return result;
    } catch (err) {
      console.error('Error fetching routes:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const openRouteDetails = (route = null) => {
    setActiveModalRoute(route || selectedRoute);
    setIsModalOpen(true);
  };

  const closeRouteDetails = () => {
    setIsModalOpen(false);
  };

  return (
    <RouteContext.Provider
      value={{
        origin,
        setOrigin,
        destination,
        setDestination,
        routes,
        selectedRouteId,
        setSelectedRouteId,
        selectedRoute,
        isCalculating,
        calculateRoutes,
        isModalOpen,
        activeModalRoute: activeModalRoute || selectedRoute,
        openRouteDetails,
        closeRouteDetails
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
};

export default RouteContext;
