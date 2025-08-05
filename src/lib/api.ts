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
        ]
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
        ]
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

  const liveRoutes: LiveRoute[] = [
    { id: "RT-001", from: "Beograd", to: "Sarajevo", status: "aktivna", progress: 67, eta: "2s 15m", driver: "Miloš P." },
    { id: "RT-002", from: "Zagreb", to: "Ljubljana", status: "završena", progress: 100, eta: "Dostavljeno", driver: "Ana K." },
    { id: "RT-003", from: "Skoplje", to: "Tirana", status: "kašnjenje", progress: 23, eta: "4s 30m", driver: "Stefan V." },
    { id: "RT-004", from: "Podgorica", to: "Pristina", status: "aktivna", progress: 89, eta: "45m", driver: "Marko D." }
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
