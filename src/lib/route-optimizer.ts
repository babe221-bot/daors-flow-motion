import { LatLngExpression } from 'leaflet';

export interface RouteInfo {
  name: string;
  distance: number; // in meters
  duration: number; // in seconds
  geometry: LatLngExpression[];
  cost: number;
  carbonEmissions: number; // in kg
}

interface OSRMRoute {
  distance: number;
  duration: number;
  geometry: {
    coordinates: number[][];
  };
}

// This is a placeholder for a more complex AI model.
// For now, it generates a few route options with different trade-offs.
export const generateRouteOptions = (osrmRoute: OSRMRoute): RouteInfo[] => {
  const { distance, duration, geometry } = osrmRoute;
  const coordinates = geometry.coordinates.map((c: number[]) => [c[1], c[0]] as LatLngExpression);

  const options: RouteInfo[] = [];

  // Option 1: Fastest route
  options.push({
    name: 'Fastest',
    distance,
    duration,
    geometry: coordinates,
    cost: calculateCost(distance, duration, 'fastest'),
    carbonEmissions: calculateCarbonEmissions(distance, 'fastest'),
  });

  // Option 2: Cheapest route
  options.push({
    name: 'Cheapest',
    distance: distance * 1.1, // Assume cheaper route is slightly longer
    duration: duration * 1.2, // and slower
    geometry: coordinates, // In a real scenario, we would fetch a different geometry
    cost: calculateCost(distance * 1.1, duration * 1.2, 'cheapest'),
    carbonEmissions: calculateCarbonEmissions(distance * 1.1, 'cheapest'),
  });

  // Option 3: Eco-friendly route
  options.push({
    name: 'Eco-Friendly',
    distance: distance * 1.05, // Assume eco route is a bit longer
    duration: duration * 1.15, // and slower
    geometry: coordinates, // In a real scenario, we would fetch a different geometry
    cost: calculateCost(distance * 1.05, duration * 1.15, 'eco'),
    carbonEmissions: calculateCarbonEmissions(distance * 1.05, 'eco'),
  });

  return options;
};

const calculateCost = (distance: number, duration: number, type: 'fastest' | 'cheapest' | 'eco'): number => {
  // Simplified cost calculation (e.g., fuel + driver time)
  const distanceInKm = distance / 1000;
  const durationInHours = duration / 3600;

  let costPerKm = 0.5; // base cost per km
  let costPerHour = 20; // base cost per hour

  if (type === 'cheapest') {
    costPerKm *= 0.8;
    costPerHour *= 0.9;
  } else if (type === 'eco') {
    costPerKm *= 0.9;
  }

  return distanceInKm * costPerKm + durationInHours * costPerHour;
};

const calculateCarbonEmissions = (distance: number, type: 'fastest' | 'cheapest' | 'eco'): number => {
  // Simplified carbon emission calculation
  const distanceInKm = distance / 1000;
  let emissionsPerKm = 0.2; // kg of CO2 per km

  if (type === 'eco') {
    emissionsPerKm *= 0.8;
  } else if (type === 'fastest') {
    emissionsPerKm *= 1.1;
  }

  return distanceInKm * emissionsPerKm;
};
