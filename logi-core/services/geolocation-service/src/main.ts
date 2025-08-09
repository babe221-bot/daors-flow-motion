import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const port = process.env.PORT || 4005;

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Vehicles & positions (mock)
const vehicles = [
  { id: 'v1', lat: 44.787197, lng: 20.457273, speed: 72, updatedAt: new Date().toISOString() },
  { id: 'v2', lat: 45.815399, lng: 15.966568, speed: 0, updatedAt: new Date().toISOString() },
];

app.get('/tracking/vehicles', (_req, res) => res.json({ success: true, data: vehicles }));

app.get('/tracking/positions/:vehicleId', (req, res) => {
  const { vehicleId } = req.params;
  const track = Array.from({ length: 10 }).map((_, i) => ({
    lat: 44.7 + i * 0.01,
    lng: 20.4 + i * 0.01,
    ts: new Date(Date.now() - (10 - i) * 60000).toISOString(),
  }));
  res.json({ success: true, data: { vehicleId, track } });
});

app.listen(port, () => {
  console.log(`Geolocation Service listening on ${port}`);
});