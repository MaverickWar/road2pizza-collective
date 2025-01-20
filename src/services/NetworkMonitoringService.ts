import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

class NetworkMonitoringService {
  private static instance: NetworkMonitoringService;
  private activeRequests: Map<string, { url: string; startTime: number; method: string }>;
  private readonly TIMEOUT_MS = 10000;

  private constructor() {
    this.activeRequests = new Map();
    this.logToAnalytics("service_start", "Network monitoring service initialized").catch(console.error);
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
    const startTime = performance.now();
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const method = init?.method || 'GET';
    const requestId = Math.random().toString(36).substring(7);

    try {
      // Log request start
      await this.logToAnalytics(
        "request_start",
        `${method} request to ${url}`,
        url,
        0,
        {
          requestId,
          method,
          headers: init?.headers ? JSON.stringify(Object.fromEntries(new Headers(init.headers).entries())) : undefined
        }
      );

      const response = await fetch(input, init);
      const duration = performance.now() - startTime;

      // Log successful response
      await this.logToAnalytics(
        "request_complete",
        `${method} request completed`,
        url,
        duration,
        {
          requestId,
          status: response.status,
          statusText: response.statusText,
          headers: JSON.stringify(Object.fromEntries(response.headers.entries())),
          duration: `${duration.toFixed(0)}ms`
        }
      );

      if (!response.ok) {
        // Log error response
        const errorBody = await response.clone().text();
        await this.logToAnalytics(
          "request_error",
          `HTTP ${response.status} error for ${method} ${url}`,
          url,
          duration,
          {
            requestId,
            error: errorBody,
            status: response.status,
            severity: response.status >= 500 ? "high" : "medium"
          }
        );
      }

      return response;
    } catch (error: any) {
      const duration = performance.now() - startTime;
      
      // Log network error
      await this.logToAnalytics(
        "network_error",
        error.message,
        url,
        duration,
        {
          requestId,
          errorType: error.name,
          stack: error.stack,
          severity: "high"
        }
      );

      throw error;
    }
  };

  private async logToAnalytics(
    type: string,
    message: string,
    url?: string,
    duration: number = 0,
    additionalMetadata: Record<string, any> = {}
  ) {
    try {
      const { error } = await supabase.from("analytics_metrics").insert({
        metric_name: type,
        metric_value: duration,
        metadata: {
          message,
          url,
          timestamp: new Date().toISOString(),
          severity: this.getSeverityLevel(type),
          status: 'open',
          ...additionalMetadata
        },
        endpoint_path: url,
        response_time: duration > 0 ? duration : null,
      });

      if (error) {
        console.error("[Analytics] Failed to log event:", error);
      }
    } catch (err) {
      console.error("[Analytics] Unexpected error logging to analytics:", err);
    }
  }

  private getSeverityLevel(type: string): string {
    if (type.includes('error')) return 'high';
    if (type.includes('warning')) return 'medium';
    return 'low';
  }

  public cleanup() {
    this.activeRequests.clear();
    this.logToAnalytics("service_cleanup", "Network monitoring service cleaned up").catch(console.error);
  }
}

export const networkMonitor = NetworkMonitoringService.getInstance();