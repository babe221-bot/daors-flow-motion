import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ResilientHttpClient } from './middleware/circuit-breaker.js';
import { AuthService, createAuthMiddleware, requireRole, requirePermission } from './middleware/auth.js';
import { metricsMiddleware, loggingMiddleware, metricsService } from './middleware/metrics.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Add metrics and structured logging
app.use(metricsMiddleware);
app.use(loggingMiddleware);

// Keep morgan for development, but structured logging in production
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({ 
  windowMs: 60 * 1000, 
  max: parseInt(process.env.RATE_LIMIT || '100'),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Initialize resilient HTTP client
const httpClient = new ResilientHttpClient({
  timeout: parseInt(process.env.SERVICE_TIMEOUT || '5000'),
  errorThresholdPercentage: parseInt(process.env.ERROR_THRESHOLD || '50'),
  resetTimeout: parseInt(process.env.CIRCUIT_RESET_TIMEOUT || '30000'),
  monitoringPeriod: parseInt(process.env.MONITORING_PERIOD || '60000')
});

// Initialize enhanced auth service
const authService = new AuthService();

// Use enhanced authentication middleware
app.use(createAuthMiddleware(authService));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Metrics endpoints
app.get('/metrics', (_req, res) => {
  res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.send(metricsService.getPrometheusMetrics());
});

app.get('/metrics/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    ...metricsService.getHealthMetrics()
  });
});

// Authentication endpoints
app.post('/auth/login', async (req, res) => {
  // This is a simplified login - in production, validate against user service
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  // Simulate user validation (replace with actual user service call)
  if (email === 'demo@example.com' && password === 'demo123') {
    const user = {
      id: 'demo-user-1',
      email,
      roles: ['user', 'driver'],
      permissions: ['read', 'write', 'track'],
      sub: 'demo-user-1'
    };
    
    const tokens = authService.generateTokenPair(user);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions
      },
      ...tokens
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }
  
  const tokens = await authService.refreshTokens(refreshToken);
  
  if (tokens) {
    res.json({ success: true, ...tokens });
  } else {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

app.post('/auth/logout', (req: any, res) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    authService.revokeRefreshToken(refreshToken);
  }
  
  res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/auth/logout-all', requireRole('user'), (req: any, res) => {
  const revokedCount = authService.revokeAllUserTokens(req.user.id);
  res.json({ success: true, revokedTokens: revokedCount });
});

app.get('/auth/me', requirePermission('read'), (req: any, res) => {
  res.json({ user: req.user });
});

// Circuit breaker status endpoint (requires admin role)
app.get('/circuit-breaker/status', requireRole('admin'), (_req, res) => {
  res.json({
    circuitBreakers: httpClient.getCircuitBreakerStatus(),
    authStats: authService.getTokenStats(),
    timestamp: new Date().toISOString()
  });
});

// Service targets (env-configurable)
const targets = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:4001',
  inventory: process.env.INVENTORY_SERVICE_URL || 'http://localhost:8000',
  orders: process.env.ORDER_SERVICE_URL || 'http://localhost:4003',
  routing: process.env.ROUTING_SERVICE_URL || 'http://localhost:4004',
  geo: process.env.GEO_SERVICE_URL || 'http://localhost:4005',
  notify: process.env.NOTIFY_SERVICE_URL || 'http://localhost:4006'
};

// Enhanced proxy with circuit breaker and fallbacks
const createResilientProxy = (serviceName: string, serviceUrl: string) => {
  return async (req: any, res: any, next: any) => {
    try {
      const user = req.user;
      const headers: any = {
        'Content-Type': 'application/json',
        ...(req.headers['x-forwarded-for'] && { 'x-forwarded-for': req.headers['x-forwarded-for'] }),
      };

      if (user) {
        headers['x-user-id'] = user.sub || user.id || 'unknown';
        headers['x-user-roles'] = Array.isArray(user.roles) ? user.roles.join(',') : '';
      }

      // Remove the API prefix from the path
      const servicePath = req.path.replace(`/api/v1/${serviceName}`, '');
      const url = `${serviceUrl}${servicePath}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;

      const response = await httpClient.request(serviceName, {
        method: req.method,
        url,
        headers,
        data: req.body,
        params: req.query,
      });

      res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error(`Error proxying to ${serviceName}:`, error.message);
      
      // Enhanced fallback responses
      const fallbackResponse = getFallbackResponse(serviceName, req.path, error);
      res.status(fallbackResponse.status).json(fallbackResponse.data);
    }
  };
};

// Fallback responses when services are unavailable
const getFallbackResponse = (serviceName: string, path: string, error: any) => {
  const isCircuitOpen = error.message?.includes('Circuit breaker') && error.message?.includes('OPEN');
  
  const baseResponse = {
    status: isCircuitOpen ? 503 : 500,
    data: {
      error: isCircuitOpen ? 'Service temporarily unavailable' : 'Internal server error',
      service: serviceName,
      fallback: true,
      timestamp: new Date().toISOString()
    }
  };

  // Service-specific fallbacks
  switch (serviceName) {
    case 'inventory':
      if (path.includes('/items')) {
        return { status: 200, data: { items: [], fallback: true, message: 'Using cached inventory data' } };
      }
      break;
    case 'notifications':
      return { status: 202, data: { message: 'Notification queued for later delivery', fallback: true } };
    case 'tracking':
      if (path.includes('/location')) {
        return { status: 200, data: { location: 'Unknown', lastUpdate: null, fallback: true } };
      }
      break;
  }

  return baseResponse;
};

app.use('/api/v1/users*', createResilientProxy('users', targets.user));
app.use('/api/v1/inventory*', createResilientProxy('inventory', targets.inventory));
app.use('/api/v1/orders*', createResilientProxy('orders', targets.orders));
app.use('/api/v1/routes*', createResilientProxy('routing', targets.routing));
app.use('/api/v1/tracking*', createResilientProxy('geo', targets.geo));
app.use('/api/v1/notifications*', createResilientProxy('notifications', targets.notify));

// Enhanced readiness probe with circuit breaker awareness
app.get('/readyz', async (_req, res) => {
  try {
    const endpoints: Record<string, string> = {
      user: `${targets.user}/health`,
      inventory: `${targets.inventory}/health`,
      orders: `${targets.orders}/health`,
      routing: `${targets.routing}/health`,
      geo: `${targets.geo}/health`,
      notify: `${targets.notify}/health`,
    };

    const results: Record<string, any> = {};
    const circuitBreakerStatus = httpClient.getCircuitBreakerStatus();
    
    await Promise.all(
      Object.entries(endpoints).map(async ([name, url]) => {
        try {
          const response = await httpClient.request(name, {
            method: 'GET',
            url,
          }, 0); // No retries for health checks
          
          results[name] = {
            status: response.data?.status || 'ok',
            circuitBreaker: circuitBreakerStatus[name] || { state: 'CLOSED', failures: 0, successes: 0 }
          };
        } catch (error: any) {
          results[name] = {
            status: 'down',
            error: error.message,
            circuitBreaker: circuitBreakerStatus[name] || { state: 'OPEN', failures: 1, successes: 0 }
          };
        }
      })
    );

    const overallStatus = Object.values(results).every((r: any) => r.status === 'ok') ? 'ok' : 'degraded';
    
    res.json({ 
      status: overallStatus, 
      services: results,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ 
      status: 'error', 
      error: (e as Error).message,
      timestamp: new Date().toISOString()
    });
  }
});

const server = app.listen(port, () => {
  console.log(`API Gateway listening on ${port}`);
  console.log('Circuit breaker status available at /circuit-breaker/status');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, starting graceful shutdown...');
  
  server.close(() => {
    console.log('HTTP server closed');
    httpClient.destroy();
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.log('Force shutdown');
    httpClient.destroy();
    process.exit(1);
  }, 10000);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, starting graceful shutdown...');
  
  server.close(() => {
    console.log('HTTP server closed');
    httpClient.destroy();
    process.exit(0);
  });
});