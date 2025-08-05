import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation } from "@tanstack/react-query";
import { fetchRoute } from "@/lib/api";
import { generateRouteOptions, RouteInfo } from "@/lib/route-optimizer";
import MapView from "@/components/MapView";
import { LatLngExpression } from "leaflet";

interface Location {
  name: string;
  coordinates: { lat: number; lng: number };
}

const locations: Location[] = [
  { name: "Belgrade, Serbia", coordinates: { lat: 44.7866, lng: 20.4489 } },
  { name: "Sarajevo, Bosnia and Herzegovina", coordinates: { lat: 43.8563, lng: 18.4131 } },
  { name: "Zagreb, Croatia", coordinates: { lat: 45.8150, lng: 15.9819 } },
  { name: "Pristina, Kosovo", coordinates: { lat: 42.6629, lng: 21.1655 } },
  { name: "Skopje, North Macedonia", coordinates: { lat: 41.9981, lng: 21.4254 } },
  { name: "Podgorica, Montenegro", coordinates: { lat: 42.4304, lng: 19.2594 } },
  { name: "Tirana, Albania", coordinates: { lat: 41.3275, lng: 19.8187 } },
];

const RouteOptimization = () => {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteInfo | null>(null);

  const mutation = useMutation({
    mutationFn: (variables: { from: Location; to: Location }) => fetchRoute(variables.from.coordinates, variables.to.coordinates),
    onSuccess: (data) => {
      const routeOptions = generateRouteOptions(data);
      setRoutes(routeOptions);
      setSelectedRoute(routeOptions[0]); // Select the first route by default
    },
    onError: (error) => {
      console.error("Error fetching route:", error);
      // Here you would show a toast notification to the user
    },
  });

  const handleFindRoutes = () => {
    if (origin && destination) {
      mutation.mutate({ from: origin, to: destination });
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const mapRoutes = selectedRoute ? [{ id: selectedRoute.name, path: selectedRoute.geometry as [number, number][] }] : [];
  const mapCenter = origin ? [origin.coordinates.lat, origin.coordinates.lng] as [number, number] : undefined;


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Route Optimization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={(value) => setOrigin(locations.find(l => l.name === value) || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Origin" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setDestination(locations.find(l => l.name === value) || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Destination" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={handleFindRoutes} disabled={!origin || !destination || mutation.isPending} className="w-full">
              {mutation.isPending ? "Finding Routes..." : "Find Routes"}
            </Button>
          </CardContent>
        </Card>

        {routes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Suggested Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Option</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>CO₂</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.map((route) => (
                    <TableRow key={route.name} onClick={() => setSelectedRoute(route)} className={selectedRoute?.name === route.name ? "bg-secondary" : ""}>
                      <TableCell className="font-medium">{route.name}</TableCell>
                      <TableCell>{formatDuration(route.duration)}</TableCell>
                      <TableCell>{(route.distance / 1000).toFixed(1)} km</TableCell>
                      <TableCell>${route.cost.toFixed(2)}</TableCell>
                      <TableCell>{route.carbonEmissions.toFixed(1)} kg</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardContent className="h-full p-0 flex items-center justify-center">
            {routes.length > 0 ? (
              <MapView routes={mapRoutes} center={mapCenter} zoom={7} />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Please select an origin and destination to see the optimized routes.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RouteOptimization;
