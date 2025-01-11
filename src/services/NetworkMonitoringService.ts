import { toast } from "sonner";

type NetworkRequest = {
  url: string;
  startTime: number;
  method: string;
};

class NetworkMonitoringService {
  private static instance: NetworkMonitoringService;
  private activeRequests: Map<string, NetworkRequest>;
  private readonly TIMEOUT_MS = 5000;

  private constructor() {
    this.activeRequests = new Map();
    console.log('Network monitoring service initialized');
  }

  static getInstance(): NetworkMonitoringService {
    if (!NetworkMonitoringService.instance) {
      NetworkMonitoringService.instance = new NetworkMonitoringService();
    }
    return NetworkMonitoringService.instance;
  }

  monitorFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const controller = new AbortController();
    const id = Math.random().toString(36).substring(7);
    const startTime = performance.now();
    
    // Handle different input types to get the URL string
    const url = input instanceof URL 
      ? input.href 
      : input instanceof Request 
        ? input.url 
        : input;
    const method = init?.method || 'GET';

    // Track request start
    this.activeRequests.set(id, {
      url,
      startTime,
      method,
    });

    console.log(`🌐 Starting ${method} request to ${url}`);

    // Set up timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
      this.logFailure(id, 'timeout');
    }, this.TIMEOUT_MS);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const duration = performance.now() - startTime;

      if (!response.ok) {
        this.logFailure(id, `HTTP ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Log slow but successful requests
      if (duration > 2000) {
        console.warn(`⚠️ Slow request to ${url} (${duration.toFixed(0)}ms)`);
      } else {
        console.log(`✅ ${method} request to ${url} completed in ${duration.toFixed(0)}ms`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error(`🚫 Request to ${url} timed out after ${this.TIMEOUT_MS}ms`);
        toast.error(`Request to ${url} timed out`);
      } else {
        console.error(`❌ Request to ${url} failed:`, error);
        toast.error(`Network request failed: ${error.message}`);
      }
      
      throw error;
    } finally {
      this.activeRequests.delete(id);
    }
  };

  private logFailure(requestId: string, reason: string) {
    const request = this.activeRequests.get(requestId);
    if (!request) return;

    const duration = performance.now() - request.startTime;
    
    console.error(`❌ ${request.method} request to ${request.url} failed:`, {
      reason,
      duration: `${duration.toFixed(0)}ms`,
      timestamp: new Date().toISOString(),
    });

    toast.error(`Request failed: ${reason}`);

    // Log the failure to analytics backend
    fetch('/api/log-analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'network_failure',
        requestId,
        reason,
        duration: duration.toFixed(0),
        timestamp: new Date().toISOString(),
      }),
    }).catch(error => {
      console.error('Error logging network failure event:', error);
    });
  }

  getActiveRequests() {
    return Array.from(this.activeRequests.values());
  }
}

export const networkMonitor = NetworkMonitoringService.getInstance();
