class NetworkMonitoringService {
  private static instance: NetworkMonitoringService;
  private readonly SUPABASE_URL = "https://zbcadnulavhsmzfvbwtn.supabase.co";
  private readonly SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiY2FkbnVsYXZoc216ZnZid3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MjQzODAsImV4cCI6MjA1MDEwMDM4MH0.hcdXgSWpLnI-QFQOVDOeyrivuSDpFuhrqOOzL-OhxsY";
  private failedRequests: any[] = [];
  private isLogging: boolean = false;
  
  private constructor() {
    this.setupGlobalErrorHandling();
    console.log('NetworkMonitoringService initialized with enhanced error tracking');
  }

  public static getInstance(): NetworkMonitoringService {
    if (!NetworkMonitoringService.instance) {
      NetworkMonitoringService.instance = new NetworkMonitoringService();
    }
    return NetworkMonitoringService.instance;
  }

  private setupGlobalErrorHandling() {
    window.addEventListener('unhandledrejection', (event) => {
      if (!this.isLogging) {
        this.logNetworkEvent({
          type: 'error_unhandled_rejection',
          message: event.reason?.message || 'Unhandled Promise Rejection',
          severity: 'high',
          status: 'error',
          errorDetails: event.reason?.stack,
        }).catch(console.error);
      }
    });

    window.addEventListener('error', (event) => {
      if (!this.isLogging) {
        this.logNetworkEvent({
          type: 'error_runtime',
          message: event.message,
          severity: 'high',
          status: 'error',
          errorDetails: event.error?.stack,
        }).catch(console.error);
      }
    });
  }

  monitorFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const startTime = performance.now();
    const url = input instanceof Request ? input.url : input.toString();
    
    // Create new headers with all required Supabase headers
    const headers = new Headers(init?.headers || {});
    headers.set('apikey', this.SUPABASE_ANON_KEY);
    headers.set('Authorization', `Bearer ${this.SUPABASE_ANON_KEY}`);
    headers.set('Content-Type', 'application/json');
    headers.set('Prefer', 'return=minimal');
    
    try {
      console.log('Making fetch request to:', url, 'with headers:', Object.fromEntries(headers.entries()));
      const response = await fetch(input, { 
        ...init, 
        headers
      });
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Only log API requests that aren't analytics logging
      if (!url.includes('analytics_metrics')) {
        await this.logApiRequest(
          url,
          startTime,
          response.status,
          responseTime,
          response.ok ? undefined : new Error(`HTTP ${response.status}`)
        ).catch(console.error);
      }
      
      if (!response.ok) {
        console.error('Request failed:', {
          url,
          status: response.status,
          statusText: response.statusText
        });
      }
      
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      const endTime = performance.now();
      
      if (!this.isLogging && !url.includes('analytics_metrics')) {
        await this.logNetworkEvent({
          type: 'network_error',
          message: error instanceof Error ? error.message : 'Network request failed',
          severity: 'critical',
          status: 'error',
          url,
          responseTime: endTime - startTime,
          errorDetails: error instanceof Error ? error.stack : undefined,
        }).catch(console.error);
      }
      
      throw error;
    }
  };

  private async logNetworkEvent(event: {
    type: string;
    message: string;
    severity?: string;
    status?: string;
    url?: string;
    httpStatus?: number;
    responseTime?: number;
    errorDetails?: string;
  }) {
    if (this.isLogging) return null;
    this.isLogging = true;

    try {
      console.log('Logging network event:', event);
      const headers = {
        'apikey': this.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      };

      const response = await fetch(`${this.SUPABASE_URL}/rest/v1/analytics_metrics`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          metric_name: event.type,
          metric_value: event.responseTime || 0,
          metadata: {
            message: event.message,
            severity: event.severity || 'low',
            status: event.status || 'open',
            url: event.url,
            errorDetails: event.errorDetails
          },
          http_status: event.httpStatus,
          endpoint_path: event.url ? new URL(event.url).pathname : null,
          response_time: event.responseTime,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        console.error('Error logging network event:', await response.text());
        this.failedRequests.push(event);
      }

      return response;
    } catch (error) {
      console.error('Failed to log network event:', error);
      this.failedRequests.push(event);
      return null;
    } finally {
      this.isLogging = false;
    }
  }

  private async logApiRequest(
    url: string, 
    startTime: number, 
    status: number, 
    responseTime: number, 
    error?: Error
  ) {
    return this.logNetworkEvent({
      type: 'api_request',
      message: error ? `API request failed: ${error.message}` : 'API request completed',
      severity: status >= 400 ? 'high' : 'low',
      status: status >= 400 ? 'error' : 'success',
      url,
      httpStatus: status,
      responseTime,
      errorDetails: error?.stack,
    });
  }
}

export const networkMonitor = NetworkMonitoringService.getInstance();