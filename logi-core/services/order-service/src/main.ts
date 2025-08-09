import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const port = process.env.PORT || 4003;

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Minimal orders API
let orders = [
  { id: 'ord_1', status: 'PENDING', placed_at: new Date().toISOString(), total: 120.5 },
  { id: 'ord_2', status: 'PROCESSING', placed_at: new Date().toISOString(), total: 87.3 },
];

app.get('/orders', (_req, res) => {
  res.json({ success: true, data: orders });
});

app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: order });
});

app.post('/orders', (req, res) => {
  const payload = req.body || {};
  const id = `ord_${Date.now()}`;
  const order = { id, status: payload.status || 'PENDING', placed_at: new Date().toISOString(), total: payload.total || 0 };
  orders.push(order);
  res.status(201).json({ success: true, data: order });
});

app.patch('/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, error: 'Not found' });
  order.status = req.body?.status || order.status;
  res.json({ success: true, data: order });
});

app.listen(port, () => {
  console.log(`Order Service listening on ${port}`);
});