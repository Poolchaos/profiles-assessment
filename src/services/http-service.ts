import Logger from '../utils/logger';

const logger = new Logger('HttpService');

interface RequestConfig {
  method: 'GET' | 'POST' | 'DELETE';
  url: string;
  data?: any;
  headers?: Record<string, string>;
}

interface Middleware {
  handle(config: RequestConfig, next: (config: RequestConfig) => Promise<any>): Promise<any>;
}

class LoggingMiddleware implements Middleware {
  async handle(config: RequestConfig, next: (config: RequestConfig) => Promise<any>): Promise<any> {
    logger.debug(`HTTP ${config.method} Request to ${config.url}`, config.data || '');
    const response = await next(config);
    logger.debug(`HTTP ${config.method} Response from ${config.url}`, response);
    return response;
  }
}

class ErrorHandlingMiddleware implements Middleware {
  async handle(config: RequestConfig, next: (config: RequestConfig) => Promise<any>): Promise<any> {
    try {
      return await next(config);
    } catch (error) {
      logger.error(`HTTP ${config.method} Error at ${config.url}`, error);
      throw error;
    }
  }
}

export class HttpService {
  private baseUrl: string = 'https://fa.bdtechnologies.ch/api/v1';
  private pipeline: Middleware[] = [new LoggingMiddleware(), new ErrorHandlingMiddleware()];

  async request<T>(config: RequestConfig): Promise<T> {
    const fullConfig: RequestConfig = {
      ...config,
      url: `${this.baseUrl}/${config.url}`,
      headers: { 'Content-Type': 'application/json', ...config.headers },
    };

    let handler = async (cfg: RequestConfig) => this.executeRequest(cfg);
    for (let i = this.pipeline.length - 1; i >= 0; i--) {
      const current = this.pipeline[i];
      const next = handler;
      handler = (cfg) => current.handle(cfg, next);
    }

    return handler(fullConfig);
  }

  private async executeRequest(config: RequestConfig): Promise<any> {
    const response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: config.data ? JSON.stringify(config.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'GET', url, headers });
  }

  post<T>(url: string, data: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'POST', url, data, headers });
  }

  delete<T>(url: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'DELETE', url, data, headers });
  }
}

export const httpService = new HttpService();
