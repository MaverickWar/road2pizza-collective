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
  private readonly TIMEOUT_MS = 5000; // Timeout threshold for requests

  private constructor() {
    this.activeRequests = new Map();
    console.log("Network monitoring service initialized but not started");
  }

  static getInstance(): NetworkMonitoringService {
    if (!NetworkMonitoringService.instance) {
      NetworkMonitoringService.instance = new NetworkMonitoringService();
    }
    return NetworkMonitoringService.instance;
  }

  public startMonitoring() {
    console.log("Network monitoring started");
    // You can add any initialization code here if needed
  }

  monitorFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const controller = new AbortController();
    const id = Math.random().toString(36).substring(7); // Unique request ID
    const startTime = performance.now();

    const url =
      input instanceof URL
        ? input.href
        : input instanceof Request
        ? input.url
        : input;

    const method = init?.method || "GET";
    this.activeRequests.set(id, { url, startTime, method });

    console.log(`🌐 Starting ${method} request to ${url}`);

    const timeoutId = setTimeout(() => {
      controller.abort();
      this.logFailure(id, "timeout");
    }, this.TIMEOUT_MS);

    try {
      const response = await fetch(input, { ...init, signal: controller.signal });

      clearTimeout(timeoutId);
      const duration = performance.now() - startTime;

      if (!response.ok) {
        this.logFailure(id, `HTTP ${response.status}`);
        this.logToAnalytics("network_error", `HTTP ${response.status}`, url, duration);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle slow requests
      if (duration > 2000) {
        console.warn(`⚠️ Slow request to ${url} (${duration.toFixed(0)}ms)`);
        this.logToAnalytics(
          "slow_request",
          "Request took longer than 2000ms",
          url,
          duration
        );
      } else {
        console.log(`✅ ${method} request to ${url} completed in ${duration.toFixed(0)}ms`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      // Timeout handling
      if (error.name === "AbortError") {
        console.error(`🚫 Request to ${url} timed out after ${this.TIMEOUT_MS}ms`);
        toast.error(`Request to ${url} timed out`);
        this.logToAnalytics("timeout", "Request timed out", url);
      } else {
        console.error(`❌ Request to ${url} failed:`, error);
        toast.error(`Network request failed: ${error.message}`);
        this.logToAnalytics("network_error", error.message, url);
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
  }

  private async logToAnalytics(type: string, message: string, url: string, duration?: number) {
    try {
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

      if (error) console.error("Error logging to analytics:", error);
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
  }
}

export const networkMonitor = NetworkMonitoringService.getInstance();

// Example usage to start monitoring if needed
// networkMonitor.startMonitoring();
