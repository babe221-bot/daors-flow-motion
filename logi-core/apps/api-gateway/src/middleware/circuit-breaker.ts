import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface CircuitBreakerOptions {
  timeout: number;
  errorThresholdPercentage: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private successes: number = 0;
  private nextAttempt: number = Date.now();
  private monitor: any;

  constructor(
    private readonly serviceName: string,
    private readonly options: CircuitBreakerOptions
  ) {
    this.startMonitoring();
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.nextAttempt <= Date.now()) {
        this.state = CircuitState.HALF_OPEN;
        console.log(`Circuit breaker for ${this.serviceName} is now HALF_OPEN`);
      } else {
        throw new Error(`Circuit breaker for ${this.serviceName} is OPEN`);
      }
    }

    try {
      const result = await Promise.race([
        operation(),
        this.timeoutPromise<T>()
      ]);

      this.onSuccess();
      return result;
    } catch (error) {
      this.onError();
      throw error;
    }
  }

  private timeoutPromise<T>(): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timeout for ${this.serviceName}`));
      }, this.options.timeout);
    });
  }

  private onSuccess(): void {
    this.failures = 0;
    this.successes++;
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.CLOSED;
      console.log(`Circuit breaker for ${this.serviceName} is now CLOSED`);
    }
  }

  private onError(): void {
    this.failures++;
    this.successes = 0;

    const totalRequests = this.failures + this.successes;
    const errorPercentage = (this.failures / Math.max(totalRequests, 1)) * 100;

    if (errorPercentage >= this.options.errorThresholdPercentage) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.options.resetTimeout;
      console.log(`Circuit breaker for ${this.serviceName} is now OPEN`);
    }
  }

  private startMonitoring(): void {
    this.monitor = setInterval(() => {
      // Reset counters periodically for sliding window effect
      this.failures = Math.floor(this.failures * 0.5);
      this.successes = Math.floor(this.successes * 0.5);
    }, this.options.monitoringPeriod);
  }

  getState(): { state: CircuitState; failures: number; successes: number } {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes
    };
  }

  destroy(): void {
    if (this.monitor) {
      clearInterval(this.monitor);
    }
  }
}

// Enhanced HTTP client with retry logic
export class ResilientHttpClient {
  private circuitBreakers = new Map<string, CircuitBreaker>();

  constructor(private readonly defaultOptions: CircuitBreakerOptions = {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
    monitoringPeriod: 60000
  }) {}

  private getCircuitBreaker(serviceName: string): CircuitBreaker {
    if (!this.circuitBreakers.has(serviceName)) {
      this.circuitBreakers.set(
        serviceName,
        new CircuitBreaker(serviceName, this.defaultOptions)
      );
    }
    return this.circuitBreakers.get(serviceName)!;
  }

  async request<T>(
    serviceName: string,
    config: AxiosRequestConfig,
    retries: number = 3
  ): Promise<AxiosResponse<T>> {
    const circuitBreaker = this.getCircuitBreaker(serviceName);

    return circuitBreaker.execute(async () => {
      let lastError: any;
      
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          return await axios(config);
        } catch (error: any) {
          lastError = error;
          
          // Don't retry for client errors (4xx)
          if (error.response?.status >= 400 && error.response?.status < 500) {
            throw error;
          }

          if (attempt < retries) {
            const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      throw lastError;
    });
  }

  getCircuitBreakerStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    for (const [serviceName, breaker] of this.circuitBreakers) {
      status[serviceName] = breaker.getState();
    }
    return status;
  }

  destroy(): void {
    for (const breaker of this.circuitBreakers.values()) {
      breaker.destroy();
    }
    this.circuitBreakers.clear();
  }
}