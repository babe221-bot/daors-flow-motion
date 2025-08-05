import { Item, ChartData, LiveRoute, MetricData } from "./types";

export const allItems: Item[] = [
    {
        id: "ITM-001", name: "Laptop", status: "In Transit", location: "Warehouse A",
        coordinates: { lat: 44.7866, lng: 20.4489 }, // Belgrade
        history: [
            { status: "Pending", timestamp: "2024-08-04 09:00 AM" },
            { status: "In Transit", timestamp: "2024-08-04 10:30 AM" },
        ],
        documents: [
            { name: "invoice-123.pdf", url: "/placeholder.pdf" },
            { name: "customs-form-abc.pdf", url: "/placeholder.pdf" },
        ],
        routeId: "RT-001",
        predictedEta: { time: "2s 5m", confidence: 85 }
    },
    {
        id: "ITM-002", name: "Monitor", status: "Delivered", location: "Customer",
        coordinates: { lat: 43.8563, lng: 18.4131 }, // Sarajevo
        history: [
            { status: "Pending", timestamp: "2024-08-03 02:15 PM" },
            { status: "In Transit", timestamp: "2024-08-03 04:00 PM" },
            { status: "Delivered", timestamp: "2024-08-04 11:00 AM" },
        ],
        documents: [
            { name: "invoice-456.pdf", url: "/placeholder.pdf" },
        ],
        routeId: "RT-002"
    },
    {
        id: "ITM-003", name: "Keyboard", status: "Pending", location: "Warehouse B",
        coordinates: { lat: 45.8150, lng: 15.9819 }, // Zagreb
        history: [
            { status: "Pending", timestamp: "2024-08-04 01:00 PM" },
        ],
        documents: []
    },
    {
        id: "ITM-004", name: "Mouse", status: "In Transit", location: "Warehouse A",
        coordinates: { lat: 44.7866, lng: 20.4489 }, // Belgrade
        history: [
            { status: "Pending", timestamp: "2024-08-04 09:00 AM" },
            { status: "In Transit", timestamp: "2024-08-04 10:30 AM" },
        ],
        documents: [
            { name: "invoice-789.pdf", url: "/placeholder.pdf" },
        ]
    },
    {
        id: "ITM-005", name: "Webcam", status: "Delivered", location: "Customer",
        coordinates: { lat: 42.6629, lng: 21.1655 }, // Pristina
        history: [
            { status: "Pending", timestamp: "2024-08-02 11:00 AM" },
            { status: "In Transit", timestamp: "2024-08-02 01:30 PM" },
            { status: "Delivered", timestamp: "2024-08-03 10:00 AM" },
        ],
        documents: []
    },
    {
        id: "ITM-006", name: "Docking Station", status: "Pending", location: "Warehouse C",
        coordinates: { lat: 41.9981, lng: 21.4254 }, // Skopje
        history: [
            { status: "Pending", timestamp: "2024-08-04 02:00 PM" },
        ],
        documents: []
    },
    {
        id: "ITM-007", name: "Power Adapter", status: "In Transit", location: "Warehouse B",
        coordinates: { lat: 45.8150, lng: 15.9819 }, // Zagreb
        history: [
            { status: "Pending", timestamp: "2024-08-04 11:00 AM" },
            { status: "In Transit", timestamp: "2024-08-04 12:30 PM" },
        ],
        documents: [
            { name: "invoice-101.pdf", url: "/placeholder.pdf" },
        ]
    },
    {
        id: "ITM-008", name: "USB Hub", status: "Delivered", location: "Customer",
        coordinates: { lat: 42.4304, lng: 19.2594 }, // Podgorica
        history: [
            { status: "Pending", timestamp: "2024-08-01 10:00 AM" },
            { status: "In Transit", timestamp: "2024-08-01 11:30 AM" },
            { status: "Delivered", timestamp: "2024-08-02 09:00 AM" },
        ],
        documents: []
    },
    {
        id: "ITM-009", name: "External HDD", status: "Pending", location: "Warehouse A",
        coordinates: { lat: 44.7866, lng: 20.4489 }, // Belgrade
        history: [
            { status: "Pending", timestamp: "2024-08-04 03:00 PM" },
        ],
        documents: []
    },
    {
        id: "ITM-010", name: "Speakers", status: "In Transit", location: "Warehouse C",
        coordinates: { lat: 41.9981, lng: 21.4254 }, // Skopje
        history: [
            { status: "Pending", timestamp: "2024-08-04 01:00 PM" },
            { status: "In Transit", timestamp: "2024-08-04 02:30 PM" },
        ],
        documents: []
    },
    {
        id: "ITM-011", name: "Microphone", status: "Delivered", location: "Customer",
        coordinates: { lat: 41.3275, lng: 19.8187 }, // Tirana
        history: [
            { status: "Pending", timestamp: "2024-08-03 09:00 AM" },
            { status: "In Transit", timestamp: "2024-08-03 10:30 AM" },
            { status: "Delivered", timestamp: "2024-08-04 08:00 AM" },
        ],
        documents: [
            { name: "invoice-112.pdf", url: "/placeholder.pdf" },
        ]
    },
    {
        id: "ITM-012", name: "Printer", status: "Pending", location: "Warehouse B",
        coordinates: { lat: 45.8150, lng: 15.9819 }, // Zagreb
        history: [
            { status: "Pending", timestamp: "2024-08-04 04:00 PM" },
        ],
        documents: []
    },
];

const shipmentData: ChartData[] = [
    { label: "U tranzitu", value: 156, color: "bg-primary" },
    { label: "Dostavljeno", value: 243, color: "bg-success" },
    { label: "Na čekanju", value: 67, color: "bg-warning" },
    { label: "Kašnjenje", value: 12, color: "bg-destructive" }
  ];

  const revenueData: ChartData[] = [
    { label: "Jan", value: 65, color: "bg-primary" },
    { label: "Feb", value: 78, color: "bg-primary" },
    { label: "Mar", value: 92, color: "bg-primary" },
    { label: "Apr", value: 85, color: "bg-primary" },
    { label: "May", value: 99, color: "bg-primary" },
    { label: "Jun", value: 105, color: "bg-primary" }
  ];

  const routeData: ChartData[] = [
    { label: "Srbija-Bosna", value: 35, color: "bg-blue-500" },
    { label: "Hrvatska-Slovenija", value: 28, color: "bg-green-500" },
    { label: "S.Makedonija-Albanija", value: 22, color: "bg-purple-500" },
    { label: "Crna Gora-Kosovo", value: 15, color: "bg-orange-500" }
  ];

import { Item, ChartData, LiveRoute, MetricData, Anomaly, Notification, ChatMessage } from "./types";

// ... (keep the existing allItems, shipmentData, etc.)

const anomalies: Anomaly[] = [
    {
        id: "ANM-001",
        type: "UNSCHEDULED_STOP",
        timestamp: "2024-08-04 11:45 AM",
        severity: "medium",
        description: "Vehicle stopped for 15 minutes in a non-designated area.",
        vehicleId: "RT-001",
    },
    {
        id: "ANM-002",
        type: "ROUTE_DEVIATION",
        timestamp: "2024-08-04 01:20 PM",
        severity: "high",
        description: "Vehicle deviated 2km from the planned route.",
        vehicleId: "RT-003",
    }
];

  const liveRoutes: LiveRoute[] = [
    { id: "RT-001", from: "Beograd", to: "Sarajevo", status: "aktivna", progress: 67, eta: "2s 15m", driver: "Miloš P.", predictedEta: { time: "2s 5m", confidence: 85 }, anomalies: [anomalies[0]], currentPosition: { lat: 44.2, lng: 19.8 }, speed: 80, lastMoved: new Date().toISOString(), plannedRoute: [{ lat: 44.7866, lng: 20.4489 }, { lat: 43.8563, lng: 18.4131 }] },
    { id: "RT-002", from: "Zagreb", to: "Ljubljana", status: "završena", progress: 100, eta: "Dostavljeno", driver: "Ana K.", predictedEta: { time: "Dostavljeno", confidence: 100 }, anomalies: [], currentPosition: { lat: 46.0569, lng: 14.5058 }, speed: 0, lastMoved: new Date().toISOString(), plannedRoute: [{ lat: 45.8150, lng: 15.9819 }, { lat: 46.0569, lng: 14.5058 }] },
    { id: "RT-003", from: "Skoplje", to: "Tirana", status: "kašnjenje", progress: 23, eta: "4s 30m", driver: "Stefan V.", predictedEta: { time: "5s", confidence: 70 }, anomalies: [anomalies[1]], currentPosition: { lat: 41.5, lng: 20.5 }, speed: 130, lastMoved: new Date().toISOString(), plannedRoute: [{ lat: 41.9981, lng: 21.4254 }, { lat: 41.3275, lng: 19.8187 }] },
    { id: "RT-004", from: "Podgorica", to: "Pristina", status: "aktivna", progress: 89, eta: "45m", driver: "Marko D.", predictedEta: { time: "40m", confidence: 95 }, anomalies: [], currentPosition: { lat: 42.5, lng: 20.2 }, speed: 90, lastMoved: new Date(Date.now() - 20 * 60 * 1000).toISOString(), plannedRoute: [{ lat: 42.4304, lng: 19.2594 }, { lat: 42.6629, lng: 21.1655 }] }
  ];

const metricData: MetricData = {
    activeShipments: {
        value: 478,
        change: "+12% od prošle sedmice",
        changeType: "positive",
    },
    totalRevenue: {
        value: 125840,
        change: "+8.2% od prošlog mjeseca",
        changeType: "positive",
    },
    onTimeDelivery: {
        value: 94.8,
        change: "+2.1% poboljšanje",
        changeType: "positive",
    },
    borderCrossings: {
        value: 1247,
        change: "23 aktivna kontrolna punkta",
        changeType: "neutral",
    },
}

const fetchData = <T>(data: T, delay = 500): Promise<T> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
}

export const getItems = (): Promise<Item[]> => fetchData(allItems);
export const getShipmentData = (): Promise<ChartData[]> => fetchData(shipmentData);
export const getRevenueData = (): Promise<ChartData[]> => fetchData(revenueData);
export const getRouteData = (): Promise<ChartData[]> => fetchData(routeData);
export const getLiveRoutes = (): Promise<LiveRoute[]> => fetchData(liveRoutes);
export const getMetricData = (): Promise<MetricData> => fetchData(metricData);
export const getAnomalies = (): Promise<Anomaly[]> => fetchData(anomalies);

const notifications: Notification[] = [
    {
        id: "NOTIF-001",
        type: "anomaly",
        message: "High severity anomaly detected for route RT-003.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: false,
        relatedId: "RT-003",
    },
    {
        id: "NOTIF-002",
        type: "status_change",
        message: "Item ITM-002 has been delivered.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: true,
        relatedId: "ITM-002",
    },
    {
        id: "NOTIF-003",
        type: "system_message",
        message: "System maintenance scheduled for tonight at 2 AM.",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        read: true,
    },
];

export const getNotifications = (): Promise<Notification[]> => fetchData(notifications);

let chatMessages: ChatMessage[] = [
    { id: "msg-1", shipmentId: "ITM-001", userId: "user-manager", username: "Manager", message: "Driver, what is your current status?", timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
    { id: "msg-2", shipmentId: "ITM-001", userId: "user-driver", username: "Miloš P.", message: "Approaching the border crossing now. Expect a slight delay.", timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString() },
    { id: "msg-3", shipmentId: "ITM-001", userId: "user-client", username: "Client", message: "Thanks for the update. Can you confirm the temperature of the cargo?", timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { id: "msg-4", shipmentId: "ITM-004", userId: "user-admin", username: "Admin", message: "This shipment is on hold at customs. I am investigating.", timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
];

export const getChatMessages = (shipmentId: string): Promise<ChatMessage[]> => {
    const messages = chatMessages.filter(m => m.shipmentId === shipmentId);
    return fetchData(messages, 200);
}

export const postChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> => {
    const newMessage: ChatMessage = {
        ...message,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
    };
    chatMessages = [...chatMessages, newMessage];
    return fetchData(newMessage, 100);
}


export const fetchRoute = async (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
  const { lng: fromLng, lat: fromLat } = from;
  const { lng: toLng, lat: toLat } = to;

  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch route');
  }

  const data = await response.json();
  return data.routes[0];
};
