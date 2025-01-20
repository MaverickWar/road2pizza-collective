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
  private readonly TIMEOUT_MS = 15000; // Increased timeout to 15 seconds
  private errorCount: number = 0;
  private lastErrorTime: number = 0;
  private readonly ERROR_THRESHOLD = 5;
  private readonly ERROR_RESET_TIME = 60000; // 1 minute
  private retryCount: Map<string, number> = new Map();
  private readonly MAX_RETRIES = 3;

  private constructor() {
    this.activeRequests = new Map();
    console.log("Network monitoring service initialized with enhanced error handling");
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

  private async retryRequest(
    input: RequestInfo | URL,
    init?: RequestInit,
    retryCount: number = 0
  ): Promise<Response> {
    const url = typeof input === 'string' ? input : input.toString();
    
    try {
      const response = await fetch(input, init);
      if (!response.ok && retryCount < this.MAX_RETRIES) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        console.log(`Retrying request to ${url} after ${delay}ms (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(input, init, retryCount + 1);
      }
      return response;
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        console.log(`Retrying failed request to ${url} after ${delay}ms (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(input, init, retryCount + 1);
      }
      throw error;
    }
  }

  monitorFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const controller = new AbortController();
    const id = Math.random().toString(36).substring(7);
    const startTime = performance.now();

    const url = typeof input === 'string' ? input : input.toString();
    const method = init?.method || "GET";

    // Skip monitoring for certain endpoints
    if (url.includes('analytics_metrics') || url.includes('analytics_logs')) {
      return fetch(input, init);
    }

    this.activeRequests.set(id, { url, startTime, method });
    console.log(`Starting request to ${url} with method ${method}`);

    const timeoutId = setTimeout(() => {
      controller.abort();
      this.logFailure(id, "timeout");
    }, this.TIMEOUT_MS);

    try {
      const response = await this.retryRequest(input, {
        ...init,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const duration = performance.now() - startTime;

      if (!response.ok) {
        if (this.shouldLogError()) {
          this.logFailure(id, `HTTP ${response.status}`);
          this.logToAnalytics("network_error", `HTTP ${response.status}`, url, duration);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (duration > 3000 && this.shouldLogError()) {
        console.warn(`⚠️ Slow request to ${url} (${duration.toFixed(0)}ms)`);
        this.logToAnalytics(
          "slow_request",
          "Request took longer than 3000ms",
          url,
          duration
        );
      }

      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === "AbortError" && this.shouldLogError()) {
        console.error(`🚫 Request to ${url} timed out after ${this.TIMEOUT_MS}ms`);
        this.logToAnalytics("timeout", "Request timed out", url);
        toast.error("Request timed out. Please try again.");
      } else if (this.shouldLogError()) {
        console.error(`❌ Request to ${url} failed:`, error);
        this.logToAnalytics("network_error", error.message, url);
        toast.error("Network error occurred. Please check your connection.");
      }

      throw error;
    } finally {
      this.activeRequests.delete(id);
    }
  };

  private logFailure(requestId: string, reason: string) {
    const request = this.activeRequests.get(requestId);
    if (!request || !this.shouldLogError()) return;

    const duration = performance.now() - request.startTime;
    console.error(`❌ ${request.method} request to ${request.url} failed:`, {
      reason,
      duration: `${duration.toFixed(0)}ms`,
      timestamp: new Date().toISOString(),
    });
  }

  private async logToAnalytics(type: string, message: string, url: string, duration?: number) {
    if (!this.shouldLogError()) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { error } = await supabase.from("analytics_metrics").insert({
          metric_name: type,
          metric_value: duration || 0,
          metadata: {
            message,
            url,
            severity: type === "timeout" || type === "network_error" ? "high" : "low",
            status: "open"
          }
        });

        if (error) {
          console.error("Error logging to analytics:", error);
        }
      }
    } catch (err) {
      console.error("Unexpected error logging to analytics:", err);
    }
  }

  getActiveRequests() {
    return Array.from(this.activeRequests.values());
  }

  public cleanup() {
    console.log("Cleaning up active network requests...");
    this.activeRequests.clear();
    this.errorCount = 0;
    this.retryCount.clear();
  }
}

export const networkMonitor = NetworkMonitoringService.getInstance();