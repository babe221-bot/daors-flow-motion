import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { io, Socket } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Truck, Navigation, Thermometer, Droplet, Clock, RotateCw } from 'lucide-react';

// Define types
interface Position {
  lat: number;
  lng: number;
  speed?: number;
  ts: string;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  status: string;
  driverId: string;
  fuelLevel: number;
  temperature: number | null;
  lastMaintenance: string;
  updatedAt: string;
}

// Custom hook for socket connection
const useSocketIO = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(url);

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  return { socket, isConnected };
};

// Custom map component that follows a vehicle
const VehicleFollower = ({ vehicleId, position }: { vehicleId: string | null, position: LatLngExpression | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (vehicleId && position) {
      map.setView(position, 14);
    }
  }, [map, vehicleId, position]);
  
  return null;
};

// Custom truck icon
const truckIcon = new Icon({
  iconUrl: '/truck-icon.svg', // Make sure to add this SVG to your public folder
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Fallback icon if the custom one fails to load
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const RealTimeTracker: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [trackHistory, setTrackHistory] = useState<Record<string, Position[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([45.0, 18.0]);
  const [autoFollow, setAutoFollow] = useState(true);
  const { toast } = useToast();
  
  // Connect to the geolocation service
  const { socket, isConnected } = useSocketIO(
    process.env.NODE_ENV === 'production' 
      ? 'https://api.yourdomain.com/geolocation' 
      : 'http://localhost:4005'
  );
  
  // Fetch initial vehicles data
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          process.env.NODE_ENV === 'production'
            ? 'https://api.yourdomain.com/geolocation/tracking/vehicles'
            : 'http://localhost:4005/tracking/vehicles'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        
        const data = await response.json();
        if (data.success && data.data) {
          setVehicles(data.data);
          if (data.data.length > 0 && !selectedVehicle) {
            setSelectedVehicle(data.data[0].id);
            fetchVehicleHistory(data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load vehicles. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehicles();
  }, [toast]);
  
  // Fetch vehicle history
  const fetchVehicleHistory = async (vehicleId: string) => {
    try {
      const response = await fetch(
        process.env.NODE_ENV === 'production'
          ? `https://api.yourdomain.com/geolocation/tracking/positions/${vehicleId}?limit=20`
          : `http://localhost:4005/tracking/positions/${vehicleId}?limit=20`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch history for vehicle ${vehicleId}`);
      }
      
      const data = await response.json();
      if (data.success && data.data && data.data.track) {
        setTrackHistory(prev => ({
          ...prev,
          [vehicleId]: data.data.track
        }));
      }
    } catch (err) {
      console.error(`Error fetching history for vehicle ${vehicleId}:`, err);
      toast({
        title: 'Error',
        description: `Failed to load history for vehicle ${vehicleId}.`,
        variant: 'destructive',
      });
    }
  };
  
  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;
    
    // Handle initial vehicles data
    socket.on('vehicles:initial', (data: Vehicle[]) => {
      setVehicles(data);
      if (data.length > 0 && !selectedVehicle) {
        setSelectedVehicle(data[0].id);
        fetchVehicleHistory(data[0].id);
      }
    });
    
    // Handle vehicle updates
    socket.on('vehicle:update', (updatedVehicle: Vehicle) => {
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
        )
      );
      
      // Update track history
      if (updatedVehicle.id === selectedVehicle) {
        setTrackHistory(prev => {
          const currentHistory = prev[updatedVehicle.id] || [];
          return {
            ...prev,
            [updatedVehicle.id]: [
              {
                lat: updatedVehicle.lat,
                lng: updatedVehicle.lng,
                speed: updatedVehicle.speed,
                ts: updatedVehicle.updatedAt
              },
              ...currentHistory.slice(0, 19) // Keep last 20 positions
            ]
          };
        });
      }
    });
    
    // Handle detailed vehicle updates
    socket.on('vehicle:detailed-update', (detailedUpdate: Vehicle) => {
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === detailedUpdate.id ? detailedUpdate : vehicle
        )
      );
    });
    
    return () => {
      socket.off('vehicles:initial');
      socket.off('vehicle:update');
      socket.off('vehicle:detailed-update');
    };
  }, [socket, selectedVehicle]);
  
  // Subscribe to selected vehicle updates
  useEffect(() => {
    if (!socket || !selectedVehicle) return;
    
    // Subscribe to detailed updates for the selected vehicle
    socket.emit('subscribe:vehicle', selectedVehicle);
    
    // Fetch history for the selected vehicle
    fetchVehicleHistory(selectedVehicle);
    
    return () => {
      // Unsubscribe when component unmounts or vehicle changes
      socket.emit('unsubscribe:vehicle', selectedVehicle);
    };
  }, [socket, selectedVehicle]);
  
  // Update map center when selected vehicle changes
  useEffect(() => {
    if (!selectedVehicle || !autoFollow) return;
    
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (vehicle) {
      setMapCenter([vehicle.lat, vehicle.lng]);
    }
  }, [vehicles, selectedVehicle, autoFollow]);
  
  // Handle vehicle selection
  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle && autoFollow) {
      setMapCenter([vehicle.lat, vehicle.lng]);
    }
  };
  
  // Get the selected vehicle
  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
  
  // Get track history for the selected vehicle
  const selectedVehicleHistory = selectedVehicle ? trackHistory[selectedVehicle] || [] : [];
  
  // Format the track history for the polyline
  const trackLine = selectedVehicleHistory.map(pos => [pos.lat, pos.lng] as LatLngExpression);
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'maintenance':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Format speed
  const formatSpeed = (speed: number) => {
    return `${Math.round(speed)} km/h`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <RotateCw className="h-8 w-8 animate-spin text-primary" />
            <p>Loading vehicle tracking data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p>{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Vehicle List */}
      <Card className="md:col-span-1 overflow-auto">
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
          <CardDescription>
            {isConnected ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Disconnected
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {vehicles.map(vehicle => (
              <div
                key={vehicle.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedVehicle === vehicle.id
                    ? 'bg-primary/10 border-l-4 border-primary'
                    : 'hover:bg-muted'
                }`}
                onClick={() => handleVehicleSelect(vehicle.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="font-medium">{vehicle.name}</span>
                  </div>
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span>{formatSpeed(vehicle.speed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span>{new Date(vehicle.updatedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Map */}
      <Card className="md:col-span-2">
        <CardHeader className="p-4">
          <div className="flex justify-between items-center">
            <CardTitle>Live Tracking</CardTitle>
            <Button
              variant={autoFollow ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoFollow(!autoFollow)}
            >
              {autoFollow ? "Auto-Follow On" : "Auto-Follow Off"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-70px)]">
          <MapContainer
            center={mapCenter}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Render all vehicles */}
            {vehicles.map(vehicle => (
              <Marker
                key={vehicle.id}
                position={[vehicle.lat, vehicle.lng]}
                icon={truckIcon}
                eventHandlers={{
                  click: () => handleVehicleSelect(vehicle.id)
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-bold">{vehicle.name}</h3>
                    <p>Type: {vehicle.type}</p>
                    <p>Speed: {formatSpeed(vehicle.speed)}</p>
                    <p>Status: {vehicle.status}</p>
                    <p>Updated: {new Date(vehicle.updatedAt).toLocaleTimeString()}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Render track history for selected vehicle */}
            {selectedVehicle && trackLine.length > 1 && (
              <Polyline
                positions={trackLine}
                color="#3b82f6"
                weight={3}
                opacity={0.7}
              />
            )}
            
            {/* Auto-follow selected vehicle */}
            {selectedVehicle && autoFollow && selectedVehicleData && (
              <VehicleFollower
                vehicleId={selectedVehicle}
                position={[selectedVehicleData.lat, selectedVehicleData.lng]}
              />
            )}
          </MapContainer>
        </CardContent>
      </Card>
      
      {/* Vehicle Details */}
      {selectedVehicleData && (
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Vehicle Details: {selectedVehicleData.name}</CardTitle>
            <CardDescription>
              ID: {selectedVehicleData.id} | Type: {selectedVehicleData.type}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="status">
              <TabsList>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="status" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Navigation className="h-4 w-4" /> Current Status
                    </h3>
                    <div className="rounded-md border p-4">
                      <div className="flex justify-between mb-2">
                        <span>Status:</span>
                        <Badge className={getStatusColor(selectedVehicleData.status)}>
                          {selectedVehicleData.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Speed:</span>
                        <span>{formatSpeed(selectedVehicleData.speed)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Heading:</span>
                        <span>{selectedVehicleData.heading}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Update:</span>
                        <span>{formatDate(selectedVehicleData.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Droplet className="h-4 w-4" /> Fuel Level
                    </h3>
                    <div className="rounded-md border p-4">
                      <Progress value={selectedVehicleData.fuelLevel} className="mb-2" />
                      <div className="flex justify-between">
                        <span>Current Level:</span>
                        <span>{Math.round(selectedVehicleData.fuelLevel)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedVehicleData.temperature !== null && (
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <Thermometer className="h-4 w-4" /> Temperature
                      </h3>
                      <div className="rounded-md border p-4">
                        <div className="text-3xl font-bold text-center mb-2">
                          {selectedVehicleData.temperature}°C
                        </div>
                        <div className="text-xs text-center text-muted-foreground">
                          {selectedVehicleData.temperature < 0 ? 'Freezer' : 'Refrigerated'} Unit
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Maintenance
                    </h3>
                    <div className="rounded-md border p-4">
                      <div className="flex justify-between">
                        <span>Last Service:</span>
                        <span>{new Date(selectedVehicleData.lastMaintenance).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="telemetry">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">Speed</div>
                      <div className="text-2xl font-bold">{formatSpeed(selectedVehicleData.speed)}</div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">Heading</div>
                      <div className="text-2xl font-bold">{selectedVehicleData.heading}°</div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">Latitude</div>
                      <div className="text-2xl font-bold">{selectedVehicleData.lat.toFixed(6)}</div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">Longitude</div>
                      <div className="text-2xl font-bold">{selectedVehicleData.lng.toFixed(6)}</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Raw Telemetry Data</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                      {JSON.stringify(selectedVehicleData, null, 2)}
                    </pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Position History</h3>
                    <Button variant="outline" size="sm" onClick={() => fetchVehicleHistory(selectedVehicleData.id)}>
                      Refresh
                    </Button>
                  </div>
                  
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2 text-left">Time</th>
                          <th className="p-2 text-left">Latitude</th>
                          <th className="p-2 text-left">Longitude</th>
                          <th className="p-2 text-left">Speed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedVehicleHistory.map((position, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{new Date(position.ts).toLocaleTimeString()}</td>
                            <td className="p-2">{position.lat.toFixed(6)}</td>
                            <td className="p-2">{position.lng.toFixed(6)}</td>
                            <td className="p-2">{position.speed ? `${Math.round(position.speed)} km/h` : 'N/A'}</td>
                          </tr>
                        ))}
                        {selectedVehicleHistory.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-muted-foreground">
                              No history available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeTracker;import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { io, Socket } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Truck, Navigation, Thermometer, Droplet, Clock, RotateCw } from 'lucide-react';

// Define types
interface Position {
  lat: number;
  lng: number;
  speed?: number;
  ts: string;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  status: string;
  driverId: string;
  fuelLevel: number;
  temperature: number | null;
  lastMaintenance: string;
  updatedAt: string;
}

// Custom hook for socket connection
const useSocketIO = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(url);

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  return { socket, isConnected };
};

// Custom map component that follows a vehicle
const VehicleFollower = ({ vehicleId, position }: { vehicleId: string | null, position: LatLngExpression | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (vehicleId && position) {
      map.setView(position, 14);
    }
  }, [map, vehicleId, position]);
  
  return null;
};

// Custom truck icon
const truckIcon = new Icon({
  iconUrl: '/truck-icon.svg', // Make sure to add this SVG to your public folder
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Fallback icon if the custom one fails to load
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const RealTimeTracker: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [trackHistory, setTrackHistory] = useState<Record<string, Position[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([45.0, 18.0]);
  const [autoFollow, setAutoFollow] = useState(true);
  const { toast } = useToast();
  
  // Connect to the geolocation service
  const { socket, isConnected } = useSocketIO(
    process.env.NODE_ENV === 'production' 
      ? 'https://api.yourdomain.com/geolocation' 
      : 'http://localhost:4005'
  );
  
  // Fetch initial vehicles data
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          process.env.NODE_ENV === 'production'
            ? 'https://api.yourdomain.com/geolocation/tracking/vehicles'
            : 'http://localhost:4005/tracking/vehicles'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        
        const data = await response.json();
        if (data.success && data.data) {
          setVehicles(data.data);
          if (data.data.length > 0 && !selectedVehicle) {
            setSelectedVehicle(data.data[0].id);
            fetchVehicleHistory(data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load vehicles. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehicles();
  }, [toast]);
  
  // Fetch vehicle history
  const fetchVehicleHistory = async (vehicleId: string) => {
    try {
      const response = await fetch(
        process.env.NODE_ENV === 'production'
          ? `https://api.yourdomain.com/geolocation/tracking/positions/${vehicleId}?limit=20`
          : `http://localhost:4005/tracking/positions/${vehicleId}?limit=20`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch history for vehicle ${vehicleId}`);
      }
      
      const data = await response.json();
      if (data.success && data.data && data.data.track) {
        setTrackHistory(prev => ({
          ...prev,
          [vehicleId]: data.data.track
        }));
      }
    } catch (err) {
      console.error(`Error fetching history for vehicle ${vehicleId}:`, err);
      toast({
        title: 'Error',
        description: `Failed to load history for vehicle ${vehicleId}.`,
        variant: 'destructive',
      });
    }
  };
  
  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;
    
    // Handle initial vehicles data
    socket.on('vehicles:initial', (data: Vehicle[]) => {
      setVehicles(data);
      if (data.length > 0 && !selectedVehicle) {
        setSelectedVehicle(data[0].id);
        fetchVehicleHistory(data[0].id);
      }
    });
    
    // Handle vehicle updates
    socket.on('vehicle:update', (updatedVehicle: Vehicle) => {
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
        )
      );
      
      // Update track history
      if (updatedVehicle.id === selectedVehicle) {
        setTrackHistory(prev => {
          const currentHistory = prev[updatedVehicle.id] || [];
          return {
            ...prev,
            [updatedVehicle.id]: [
              {
                lat: updatedVehicle.lat,
                lng: updatedVehicle.lng,
                speed: updatedVehicle.speed,
                ts: updatedVehicle.updatedAt
              },
              ...currentHistory.slice(0, 19) // Keep last 20 positions
            ]
          };
        });
      }
    });
    
    // Handle detailed vehicle updates
    socket.on('vehicle:detailed-update', (detailedUpdate: Vehicle) => {
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === detailedUpdate.id ? detailedUpdate : vehicle
        )
      );
    });
    
    return () => {
      socket.off('vehicles:initial');
      socket.off('vehicle:update');
      socket.off('vehicle:detailed-update');
    };
  }, [socket, selectedVehicle]);
  
  // Subscribe to selected vehicle updates
  useEffect(() => {
    if (!socket || !selectedVehicle) return;
    
    // Subscribe to detailed updates for the selected vehicle
    socket.emit('subscribe:vehicle', selectedVehicle);
    
    // Fetch history for the selected vehicle
    fetchVehicleHistory(selectedVehicle);
    
    return () => {
      // Unsubscribe when component unmounts or vehicle changes
      socket.emit('unsubscribe:vehicle', selectedVehicle);
    };
  }, [socket, selectedVehicle]);
  
  // Update map center when selected vehicle changes
  useEffect(() => {
    if (!selectedVehicle || !autoFollow) return;
    
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (vehicle) {
      setMapCenter([vehicle.lat, vehicle.lng]);
    }
  }, [vehicles, selectedVehicle, autoFollow]);
  
  // Handle vehicle selection
  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle && autoFollow) {
      setMapCenter([vehicle.lat, vehicle.lng]);
    }
  };
  
  // Get the selected vehicle
  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
  
  // Get track history for the selected vehicle
  const selectedVehicleHistory = selectedVehicle ? trackHistory[selectedVehicle] || [] : [];
  
  // Format the track history for the polyline
  const trackLine = selectedVehicleHistory.map(pos => [pos.lat, pos.lng] as LatLngExpression);
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'maintenance':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Format speed
  const formatSpeed = (speed: number) => {
    return `${Math.round(speed)} km/h`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <RotateCw className="h-8 w-8 animate-spin text-primary" />
            <p>Loading vehicle tracking data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p>{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Vehicle List */}
      <Card className="md:col-span-1 overflow-auto">
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
          <CardDescription>
            {isConnected ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Disconnected
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {vehicles.map(vehicle => (
              <div
                key={vehicle.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedVehicle === vehicle.id
                    ? 'bg-primary/10 border-l-4 border-primary'
                    : 'hover:bg-muted'
                }`}
                onClick={() => handleVehicleSelect(vehicle.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="font-medium">{vehicle.name}</span>
                  </div>
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span>{formatSpeed(vehicle.speed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span>{new Date(vehicle.updatedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Map */}
      <Card className="md:col-span-2">
        <CardHeader className="p-4">
          <div className="flex justify-between items-center">
            <CardTitle>Live Tracking</CardTitle>
            <Button
              variant={autoFollow ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoFollow(!autoFollow)}
            >
              {autoFollow ? "Auto-Follow On" : "Auto-Follow Off"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-70px)]">
          <MapContainer
            center={mapCenter}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Render all vehicles */}
            {vehicles.map(vehicle => (
              <Marker
                key={vehicle.id}
                position={[vehicle.lat, vehicle.lng]}
                icon={truckIcon}
                eventHandlers={{
                  click: () => handleVehicleSelect(vehicle.id)
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-bold">{vehicle.name}</h3>
                    <p>Type: {vehicle.type}</p>
                    <p>Speed: {formatSpeed(vehicle.speed)}</p>
                    <p>Status: {vehicle.status}</p>
                    <p>Updated: {new Date(vehicle.updatedAt).toLocaleTimeString()}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Render track history for selected vehicle */}
            {selectedVehicle && trackLine.length > 1 && (
              <Polyline
                positions={trackLine}
                color="#3b82f6"
                weight={3}
                opacity={0.7}
              />
            )}
            
            {/* Auto-follow selected vehicle */}
            {selectedVehicle && autoFollow && selectedVehicleData && (
              <VehicleFollower
                vehicleId={selectedVehicle}
                position={[selectedVehicleData.lat, selectedVehicleData.lng]}
              />
            )}
          </MapContainer>
        </CardContent>
      </Card>
      
      {/* Vehicle Details */}
      {selectedVehicleData && (
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Vehicle Details: {selectedVehicleData.name}</CardTitle>
            <CardDescription>
              ID: {selectedVehicleData.id} | Type: {selectedVehicleData.type}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="status">
              <TabsList>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="status" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Navigation className="h-4 w-4" /> Current Status
                    </h3>
                    <div className="rounded-md border p-4">
                      <div className="flex justify-between mb-2">
                        <span>Status:</span>
                        <Badge className={getStatusColor(selectedVehicleData.status)}>
                          {selectedVehicleData.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Speed:</span>
                        <span>{formatSpeed(selectedVehicleData.speed)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Heading:</span>
                        <span>{selectedVehicleData.heading}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Update:</span>
                        <span>{formatDate(selectedVehicleData.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Droplet className="h-4 w-4" /> Fuel Level
                    </h3>
                    <div className="rounded-md border p-4">
                      <Progress value={selectedVehicleData.fuelLevel} className="mb-2" />
                      <div className="flex justify-between">
                        <span>Current Level:</span>
                        <span>{Math.round(selectedVehicleData.fuelLevel)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedVehicleData.temperature !== null && (
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <Thermometer className="h-4 w-4" /> Temperature
                      </h3>
                      <div className="rounded-md border p-4">
                        <div className="text-3xl font-bold text-center mb-2">
                          {selectedVehicleData.temperature}°C
                        </div>
                        <div className="text-xs text-center text-muted-foreground">
                          {selectedVehicleData.temperature < 0 ? 'Freezer' : 'Refrigerated'} Unit
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Maintenance
                    </h3>
                    <div className="rounded-md border p-4">
                      <div className="flex justify-between">
                        <span>Last Service:</span>
                        <span>{new Date(selectedVehicleData.lastMaintenance).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="telemetry">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">Speed</div>
                      <div className="text-2xl font-bold">{formatSpeed(selectedVehicleData.speed)}</div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">Heading</div>
                      <div className="text-2xl font-bold">{selectedVehicleData.heading}°</div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">Latitude</div>
                      <div className="text-2xl font-bold">{selectedVehicleData.lat.toFixed(6)}</div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">Longitude</div>
                      <div className="text-2xl font-bold">{selectedVehicleData.lng.toFixed(6)}</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Raw Telemetry Data</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                      {JSON.stringify(selectedVehicleData, null, 2)}
                    </pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Position History</h3>
                    <Button variant="outline" size="sm" onClick={() => fetchVehicleHistory(selectedVehicleData.id)}>
                      Refresh
                    </Button>
                  </div>
                  
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2 text-left">Time</th>
                          <th className="p-2 text-left">Latitude</th>
                          <th className="p-2 text-left">Longitude</th>
                          <th className="p-2 text-left">Speed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedVehicleHistory.map((position, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{new Date(position.ts).toLocaleTimeString()}</td>
                            <td className="p-2">{position.lat.toFixed(6)}</td>
                            <td className="p-2">{position.lng.toFixed(6)}</td>
                            <td className="p-2">{position.speed ? `${Math.round(position.speed)} km/h` : 'N/A'}</td>
                          </tr>
                        ))}
                        {selectedVehicleHistory.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-muted-foreground">
                              No history available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeTracker;