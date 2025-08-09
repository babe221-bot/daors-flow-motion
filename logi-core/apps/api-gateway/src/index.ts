import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

// Simple JWT auth middleware (RBAC-ready)
app.use((req, res, next) => {
  if (req.path.startsWith('/public') || req.path === '/health') return next();
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = auth.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    // Attach roles/claims
    (req as any).user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Service targets (env-configurable)
const targets = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:4001',
  inventory: process.env.INVENTORY_SERVICE_URL || 'http://localhost:8000',
  orders: process.env.ORDER_SERVICE_URL || 'http://localhost:4003',
  routing: process.env.ROUTING_SERVICE_URL || 'http://localhost:4004',
  geo: process.env.GEO_SERVICE_URL || 'http://localhost:4005',
  notify: process.env.NOTIFY_SERVICE_URL || 'http://localhost:4006'
};

// Basic proxy routes
app.use('/api/v1/users', createProxyMiddleware({ target: targets.user, changeOrigin: true }));
app.use('/api/v1/inventory', createProxyMiddleware({ target: targets.inventory, changeOrigin: true }));
app.use('/api/v1/orders', createProxyMiddleware({ target: targets.orders, changeOrigin: true }));
app.use('/api/v1/routes', createProxyMiddleware({ target: targets.routing, changeOrigin: true }));
app.use('/api/v1/tracking', createProxyMiddleware({ target: targets.geo, changeOrigin: true }));
app.use('/api/v1/notifications', createProxyMiddleware({ target: targets.notify, changeOrigin: true }));

app.listen(port, () => {
  console.log(`API Gateway listening on ${port}`);
});