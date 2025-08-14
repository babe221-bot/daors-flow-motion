import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

interface MetricsCollector {
  requestDuration: Map<string, number[]>;
  requestCount: Map<string, number>;
  errorCount: Map<string, number>;
  activeConnections: number;
  circuitBreakerMetrics: Map<string, any>;
}

export class MetricsService {
  private metrics: MetricsCollector = {
    requestDuration: new Map(),
    requestCount: new Map(),
    errorCount: new Map(),
    activeConnections: 0,
    circuitBreakerMetrics: new Map()
  };

  recordRequest(method: string, route: string, duration: number, statusCode: number): void {
    const key = `${method}_${route}`;
    
    // Update request count
    this.metrics.requestCount.set(key, (this.metrics.requestCount.get(key) || 0) + 1);
    
    // Record duration
    if (!this.metrics.requestDuration.has(key)) {
      this.metrics.requestDuration.set(key, []);
    }
    this.metrics.requestDuration.get(key)!.push(duration);
    
    // Keep only last 1000 measurements for memory efficiency
    const durations = this.metrics.requestDuration.get(key)!;
    if (durations.length > 1000) {
      durations.shift();
    }
    
    // Record errors
    if (statusCode >= 400) {
      const errorKey = `${key}_${statusCode}`;
      this.metrics.errorCount.set(errorKey, (this.metrics.errorCount.get(errorKey) || 0) + 1);
    }
  }

  recordCircuitBreakerEvent(serviceName: string, event: 'success' | 'failure' | 'timeout' | 'circuit_open'): void {
    if (!this.metrics.circuitBreakerMetrics.has(serviceName)) {
      this.metrics.circuitBreakerMetrics.set(serviceName, {
        success: 0,
        failure: 0,
        timeout: 0,
        circuit_open: 0
      });
    }
    
    const serviceMetrics = this.metrics.circuitBreakerMetrics.get(serviceName)!;
    serviceMetrics[event]++;
  }

  incrementActiveConnections(): void {
    this.metrics.activeConnections++;
  }

  decrementActiveConnections(): void {
    this.metrics.activeConnections--;
  }

  getPrometheusMetrics(): string {
    let output = '';
    
    // Request count metrics
    output += '# HELP api_requests_total Total number of API requests\n';
    output += '# TYPE api_requests_total counter\n';
    for (const [key, count] of this.metrics.requestCount) {
      const [method, route] = key.split('_', 2);
      output += `api_requests_total{method="${method}",route="${route}"} ${count}\n`;
    }
    
    // Request duration metrics
    output += '\n# HELP api_request_duration_seconds Request duration in seconds\n';
    output += '# TYPE api_request_duration_seconds histogram\n';
    
    for (const [key, durations] of this.metrics.requestDuration) {
      if (durations.length === 0) continue;
      
      const [method, route] = key.split('_', 2);
      const sorted = [...durations].sort((a, b) => a - b);
      
      // Calculate percentiles
      const p50 = sorted[Math.floor(sorted.length * 0.5)];
      const p95 = sorted[Math.floor(sorted.length * 0.95)];
      const p99 = sorted[Math.floor(sorted.length * 0.99)];
      const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
      
      output += `api_request_duration_seconds{method="${method}",route="${route}",quantile="0.5"} ${(p50 / 1000).toFixed(3)}\n`;
      output += `api_request_duration_seconds{method="${method}",route="${route}",quantile="0.95"} ${(p95 / 1000).toFixed(3)}\n`;
      output += `api_request_duration_seconds{method="${method}",route="${route}",quantile="0.99"} ${(p99 / 1000).toFixed(3)}\n`;
      output += `api_request_duration_seconds_sum{method="${method}",route="${route}"} ${(sorted.reduce((a, b) => a + b, 0) / 1000).toFixed(3)}\n`;
      output += `api_request_duration_seconds_count{method="${method}",route="${route}"} ${sorted.length}\n`;
    }
    
    // Error metrics
    output += '\n# HELP api_errors_total Total number of API errors\n';
    output += '# TYPE api_errors_total counter\n';
    for (const [key, count] of this.metrics.errorCount) {
      const parts = key.split('_');
      const statusCode = parts[parts.length - 1];
      const routeMethod = parts.slice(0, -1).join('_');
      const [method, route] = routeMethod.split('_', 2);
      output += `api_errors_total{method="${method}",route="${route}",status_code="${statusCode}"} ${count}\n`;
    }
    
    // Active connections
    output += '\n# HELP api_active_connections Current number of active connections\n';
    output += '# TYPE api_active_connections gauge\n';
    output += `api_active_connections ${this.metrics.activeConnections}\n`;
    
    // Circuit breaker metrics
    output += '\n# HELP circuit_breaker_events_total Circuit breaker events\n';
    output += '# TYPE circuit_breaker_events_total counter\n';
    for (const [serviceName, events] of this.metrics.circuitBreakerMetrics) {
      for (const [eventType, count] of Object.entries(events)) {
        output += `circuit_breaker_events_total{service="${serviceName}",event="${eventType}"} ${count}\n`;
      }
    }
    
    return output;
  }

  getHealthMetrics(): any {
    const now = Date.now();
    const last5Min = now - (5 * 60 * 1000);
    
    let totalRequests = 0;
    let totalErrors = 0;
    let avgResponseTime = 0;
    
    for (const count of this.metrics.requestCount.values()) {
      totalRequests += count;
    }
    
    for (const count of this.metrics.errorCount.values()) {
      totalErrors += count;
    }
    
    // Calculate average response time across all routes
    let totalDuration = 0;
    let totalMeasurements = 0;
    for (const durations of this.metrics.requestDuration.values()) {
      totalDuration += durations.reduce((a, b) => a + b, 0);
      totalMeasurements += durations.length;
    }
    avgResponseTime = totalMeasurements > 0 ? totalDuration / totalMeasurements : 0;
    
    return {
      totalRequests,
      totalErrors,
      errorRate: totalRequests > 0 ? (totalErrors / totalRequests * 100).toFixed(2) : '0.00',
      avgResponseTime: avgResponseTime.toFixed(2),
      activeConnections: this.metrics.activeConnections,
      circuitBreakerStatus: Object.fromEntries(this.metrics.circuitBreakerMetrics)
    };
  }

  reset(): void {
    this.metrics = {
      requestDuration: new Map(),
      requestCount: new Map(),
      errorCount: new Map(),
      activeConnections: 0,
      circuitBreakerMetrics: new Map()
    };
  }
}

export const metricsService = new MetricsService();

// Middleware to collect metrics
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = performance.now();
  metricsService.incrementActiveConnections();
  
  // Override res.end to capture response time and status
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any, cb?: any) {
    const duration = performance.now() - startTime;
    const route = req.route?.path || req.path.replace(/\/\d+/g, '/:id'); // Normalize IDs
    
    metricsService.recordRequest(req.method, route, duration, res.statusCode);
    metricsService.decrementActiveConnections();
    
    // Call original end
    originalEnd.call(this, chunk, encoding, cb);
  };
  
  next();
};

// Structured logging middleware
export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Add request ID to request for tracing
  (req as any).requestId = requestId;
  res.setHeader('x-request-id', requestId);
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any, cb?: any) {
    const duration = Date.now() - startTime;
    
    const logData = {
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
      userId: (req as any).user?.id || 'anonymous'
    };
    
    // Log as JSON for structured logging
    if (res.statusCode >= 400) {
      console.error('API_ERROR', JSON.stringify(logData));
    } else {
      console.log('API_REQUEST', JSON.stringify(logData));
    }
    
    originalEnd.call(this, chunk, encoding, cb);
  };
  
  next();
};