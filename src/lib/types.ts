export interface Item {
    id: string;
    name: string;
    status: string;
    location: string;
    coordinates: { lat: number; lng: number };
    history: { status: string; timestamp: string }[];
    documents: { name: string; url: string }[];
}

export interface ChartData {
    label: string;
    value: number;
    color: string;
}

export interface LiveRoute {
    id: string;
    from: string;
    to: string;
    status: string;
    progress: number;
    eta: string;
    driver: string;
}

export interface Metric {
    value: number;
    change: string;
    changeType: "positive" | "negative" | "neutral";
}

export interface MetricData {
    activeShipments: Metric;
    totalRevenue: Metric;
    onTimeDelivery: Metric;
    borderCrossings: Metric;
}

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  DRIVER: 'DRIVER',
  CLIENT: 'CLIENT',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export interface User {
  id: string;
  username: string;
  role: Role;
  avatarUrl?: string;
  associatedItemIds?: string[];
}
