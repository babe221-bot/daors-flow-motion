import { Pool, PoolConfig, PoolClient } from 'pg';
import { performance } from 'perf_hooks';

interface DatabaseMetrics {
  activeConnections: number;
  totalQueries: number;
  averageQueryTime: number;
  slowQueries: number;
  errors: number;
}

export class DatabaseConnection {
  private pool: Pool;
  private metrics: DatabaseMetrics = {
    activeConnections: 0,
    totalQueries: 0,
    averageQueryTime: 0,
    slowQueries: 0,
    errors: 0
  };
  private queryTimes: number[] = [];

  constructor() {
    const config: PoolConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'logicore',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      // Connection pool settings
      max: parseInt(process.env.DB_POOL_MAX || '20'),
      min: parseInt(process.env.DB_POOL_MIN || '5'),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000'),
      // SSL settings for production
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };

    this.pool = new Pool(config);

    // Monitor pool events
    this.pool.on('connect', () => {
      this.metrics.activeConnections++;
      console.log(`Database connected. Active connections: ${this.metrics.activeConnections}`);
    });

    this.pool.on('remove', () => {
      this.metrics.activeConnections--;
      console.log(`Database disconnected. Active connections: ${this.metrics.activeConnections}`);
    });

    this.pool.on('error', (error) => {
      this.metrics.errors++;
      console.error('Database pool error:', error);
    });
  }

  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const startTime = performance.now();
    
    try {
      const result = await this.pool.query(text, params);
      
      const duration = performance.now() - startTime;
      this.recordQueryMetrics(duration);
      
      console.log(`Query executed in ${duration.toFixed(2)}ms: ${text.substring(0, 50)}...`);
      
      return result.rows as T[];
    } catch (error) {
      this.metrics.errors++;
      console.error('Database query error:', error);
      console.error('Query:', text);
      console.error('Params:', params);
      throw error;
    }
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      this.metrics.errors++;
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  private recordQueryMetrics(duration: number): void {
    this.metrics.totalQueries++;
    
    // Track slow queries (>1 second)
    if (duration > 1000) {
      this.metrics.slowQueries++;
      console.warn(`Slow query detected: ${duration.toFixed(2)}ms`);
    }

    // Keep last 1000 query times for average calculation
    this.queryTimes.push(duration);
    if (this.queryTimes.length > 1000) {
      this.queryTimes.shift();
    }

    // Update average
    this.metrics.averageQueryTime = 
      this.queryTimes.reduce((sum, time) => sum + time, 0) / this.queryTimes.length;
  }

  getMetrics(): DatabaseMetrics {
    return { ...this.metrics };
  }

  getHealthStatus(): { status: string; details: any } {
    const metrics = this.getMetrics();
    const status = metrics.errors === 0 && metrics.activeConnections > 0 ? 'healthy' : 'degraded';
    
    return {
      status,
      details: {
        ...metrics,
        poolSize: this.pool.totalCount,
        idleConnections: this.pool.idleCount,
        waitingClients: this.pool.waitingCount
      }
    };
  }

  async close(): Promise<void> {
    await this.pool.end();
    console.log('Database connection pool closed');
  }
}

// Repository base class with common CRUD operations
export abstract class BaseRepository<T> {
  constructor(protected db: DatabaseConnection, protected tableName: string) {}

  async findById(id: string): Promise<T | null> {
    const results = await this.db.query<T>(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return results[0] || null;
  }

  async findAll(limit: number = 100, offset: number = 0): Promise<T[]> {
    return await this.db.query<T>(
      `SELECT * FROM ${this.tableName} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
  }

  async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data as any);
    const values = Object.values(data as any);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    
    const results = await this.db.query<T>(
      `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    
    return results[0];
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data as any);
    const values = Object.values(data as any);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    
    const results = await this.db.query<T>(
      `UPDATE ${this.tableName} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    
    return results[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const results = await this.db.query(
      `DELETE FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    
    return (results as any).rowCount > 0;
  }

  async count(whereClause?: string, params?: any[]): Promise<number> {
    const query = whereClause 
      ? `SELECT COUNT(*) as count FROM ${this.tableName} WHERE ${whereClause}`
      : `SELECT COUNT(*) as count FROM ${this.tableName}`;
    
    const results = await this.db.query<{ count: string }>(query, params);
    return parseInt(results[0].count);
  }
}