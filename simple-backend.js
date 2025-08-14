// Simple backend server for Flow Motion
import express from 'express';
import cors from 'cors';
const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date().toISOString() });
});

// Mock data endpoints
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    totalOrders: 1247,
    activeShipments: 89,
    totalRevenue: 2847392,
    deliveryRate: 98.5
  });
});

app.get('/api/orders', (req, res) => {
  res.json([
    { id: 1, customer: 'Acme Corp', status: 'delivered', total: 1250.00 },
    { id: 2, customer: 'Tech Solutions', status: 'in-transit', total: 890.50 },
    { id: 3, customer: 'Global Industries', status: 'pending', total: 2100.75 }
  ]);
});

app.get('/api/shipments', (req, res) => {
  res.json([
    { id: 1, trackingNumber: 'TRK001', status: 'in-transit', destination: 'New York' },
    { id: 2, trackingNumber: 'TRK002', status: 'delivered', destination: 'Los Angeles' },
    { id: 3, trackingNumber: 'TRK003', status: 'pending', destination: 'Chicago' }
  ]);
});

// Catch all for unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

app.listen(port, () => {
  console.log(`🚀 Simple backend server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔌 API endpoints available at http://localhost:${port}/api/*`);
});