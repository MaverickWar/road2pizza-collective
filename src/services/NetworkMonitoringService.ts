import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type NetworkRequest = {
  url: string;
  startTime: number;
  method: string;
};

class NetworkMonitoringService {
  private static instance: NetworkMonitoringService;
  private activeRequests: Map<string, NetworkRequest>;
  private readonly TIMEOUT_MS = 10000;
  private errorCount: number = 0;
  private lastErrorTime: number = 0;
  private readonly ERROR_THRESHOLD = 5;
  private readonly ERROR_RESET_TIME = 60000;

  private constructor() {
    this.activeRequests = new Map();
    console.log("Network monitoring service initialized");
  }

  static getInstance(): NetworkMonitoringService {
    if (!NetworkMonitoringService.instance) {
      NetworkMonitoringService.instance = new NetworkMonitoringService();
    }
    return NetworkMonitoringService.instance;
  }

  private shouldLogError(): boolean {
    const now = Date.now();
    if (now - this.lastErrorTime > this.ERROR_RESET_TIME) {
      this.errorCount = 0;
    }
    
    if (this.errorCount >= this.ERROR_THRESHOLD) {
      return false;
    }
    
    this.errorCount++;
    this.lastErrorTime = now;
    return true;
  }

  monitorFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const controller = new AbortController();
    const id = Math.random().toString(36).substring(7);
    const startTime = performance.now();

    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const method = init?.method || "GET";

    // Enhanced logging for all requests
    console.log(`[Network] Starting ${method} request to ${url}`, {
      requestId: id,
      timestamp: new Date().toISOString(),
      headers: init?.headers,
      body: init?.body ? JSON.parse(init.body as string) : undefined
    });

    // Log analytics metrics for the request
    await this.logToAnalytics("request_started", `${method} request to ${url} started`, url);

    try {
      // Check session for authenticated requests
      if (url.includes('supabase.co') && !url.includes('auth')) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.warn('[Network] Attempting authenticated request without session:', { url, method });
          await this.logToAnalytics("auth_error", "Attempted request without session", url);
          return Promise.reject(new Error('No authenticated session'));
        }
      }

      const response = await fetch(input, { ...init, signal: controller.signal });
      const duration = performance.now() - startTime;

      // Enhanced response logging
      console.log(`[Network] Completed ${method} request to ${url}`, {
        requestId: id,
        status: response.status,
        duration: `${duration.toFixed(0)}ms`,
        timestamp: new Date().toISOString(),
        headers: Object.fromEntries(response.headers.entries())
      });

      // Log performance metrics
      await this.logToAnalytics(
        "response_time",
        `Request completed in ${duration.toFixed(0)}ms`,
        url,
        duration
      );

      if (!response.ok) {
        const errorBody = await response.clone().text();
        console.error(`[Network] Error response from ${url}:`, {
          status: response.status,
          body: errorBody,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        await this.logToAnalytics(
          "http_error",
          `HTTP ${response.status} error for ${method} ${url}`,
          url,
          duration,
          {
            error: errorBody,
            status: response.status
          }
        );
      }

      return response;
    } catch (error: any) {
      const duration = performance.now() - startTime;
      
      console.error(`[Network] Request failed for ${url}:`, {
        error: error.message,
        stack: error.stack,
        duration: `${duration.toFixed(0)}ms`
      });

      await this.logToAnalytics(
        "network_error",
        error.message,
        url,
        duration,
        {
          errorType: error.name,
          stack: error.stack
        }
      );

      throw error;
    }
  };

  private async logToAnalytics(
    type: string,
    message: string,
    url: string,
    duration?: number,
    additionalMetadata?: Record<string, any>
  ) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const metadata = {
        message,
        url,
        timestamp: new Date().toISOString(),
        user_id: session?.user?.id,
        severity: this.getSeverityLevel(type),
        status: 'open',
        ...additionalMetadata
      };

      const { error } = await supabase.from("analytics_metrics").insert({
        metric_name: type,
        metric_value: duration || 0,
        metadata,
        http_status: additionalMetadata?.status,
        endpoint_path: url,
        response_time: duration
      });

      if (error) {
        console.error("[Analytics] Error logging to analytics:", error);
      }
    } catch (err) {
      console.error("[Analytics] Unexpected error logging to analytics:", err);
    }
  }

  private getSeverityLevel(type: string): string {
    switch (type) {
      case 'network_error':
      case 'http_error':
        return 'high';
      case 'slow_request':
        return 'medium';
      default:
        return 'low';
    }
  }

  public cleanup() {
    console.log("Cleaning up active network requests...");
    this.activeRequests.clear();
    this.errorCount = 0;
  }
}

export const networkMonitor = NetworkMonitoringService.getInstance();
