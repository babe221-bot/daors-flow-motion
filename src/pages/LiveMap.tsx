import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Map } from "lucide-react";
import MapView, { Vehicle } from "@/components/MapView";
import { startGpsSimulation, stopGpsSimulation, getVehicles, getRoutes } from "@/lib/gps-simulator";

const LiveMap = () => {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<Vehicle[]>(getVehicles());
  const routes = getRoutes();

  useEffect(() => {
    // Start the simulation when the component mounts
    startGpsSimulation(setVehicles);

    // Stop the simulation when the component unmounts
    return () => {
      stopGpsSimulation();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background/80 backdrop-blur-sm border-b p-4 z-10">
        <h1 className="text-2xl font-bold flex items-center gradient-text">
          <Map className="mr-2" />
          {t('liveMap.title', 'Live Map Tracking')}
        </h1>
      </header>
      <main className="flex-grow bg-muted relative">
        <MapView
          vehicles={vehicles}
          routes={routes}
        />
      </main>
    </div>
  );
};

export default LiveMap;
