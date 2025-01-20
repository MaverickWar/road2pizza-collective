class NetworkMonitoringService {
  private static instance: NetworkMonitoringService;
  private readonly SUPABASE_URL = "https://zbcadnulavhsmzfvbwtn.supabase.co";
  private readonly SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiY2FkbnVsYXZoc216ZnZid3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1MjQzODAsImV4cCI6MjA1MDEwMDM4MH0.hcdXgSWpLnI-QFQOVDOeyrivuSDpFuhrqOOzL-OhxsY";
  
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
      this.logNetworkEvent({
        type: 'error_unhandled_rejection',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        severity: 'high',
        status: 'error',
        errorDetails: event.reason?.stack,
        metadata: {
          type: event.reason?.name,
          timestamp: new Date().toISOString()
        }
      });
    });

    window.addEventListener('error', (event) => {
      this.logNetworkEvent({
        type: 'error_runtime',
        message: event.message,
        severity: 'high',
        status: 'error',
        errorDetails: event.error?.stack,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: new Date().toISOString()
        }
      });
    });
  }

  monitorFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const startTime = performance.now();
    const url = input instanceof Request ? input.url : input.toString();
    
    console.log('Monitoring fetch request:', { url, init });
    
    try {
      const response = await fetch(input, init);
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Don't log analytics_metrics requests to avoid infinite loop
      if ((url.includes('/api/') || url.includes('supabase')) && 
          !url.includes('analytics_metrics')) {
        await this.logApiRequest(
          url,
          startTime,
          response.status,
          responseTime,
          response.ok ? undefined : new Error(`HTTP ${response.status}`)
        );
      }
      
      if (!response.ok) {
        const errorText = await response.clone().text();
        await this.logNetworkEvent({
          type: 'api_error',
          message: `API request failed with status ${response.status}`,
          severity: response.status >= 500 ? 'critical' : 'high',
          status: 'error',
          url,
          httpStatus: response.status,
          responseTime,
          errorDetails: errorText,
        });
      }
      
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      const endTime = performance.now();
      
      await this.logNetworkEvent({
        type: 'network_error',
        message: error instanceof Error ? error.message : 'Network request failed',
        severity: 'critical',
        status: 'error',
        url,
        httpStatus: 0,
        responseTime: endTime - startTime,
        errorDetails: error instanceof Error ? error.stack : undefined,
      });
      
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
    metadata?: any;
  }) {
    try {
      console.log('Logging network event:', event);

      // Use direct fetch instead of Supabase client to avoid circular dependency
      const response = await fetch(`${this.SUPABASE_URL}/rest/v1/analytics_metrics`, {
        method: 'POST',
        headers: {
          'apikey': this.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify([{
          metric_name: event.type,
          metric_value: event.responseTime || 0,
          metadata: {
            message: event.message,
            severity: event.severity || 'low',
            status: event.status || 'open',
            url: event.url,
            errorDetails: event.errorDetails,
            ...event.metadata
          },
          http_status: event.httpStatus,
          endpoint_path: event.url ? new URL(event.url).pathname : null,
          response_time: event.responseTime,
          timestamp: new Date().toISOString()
        }])
      });

      if (!response.ok) {
        console.error('Error logging network event:', await response.text());
        return null;
      }

      console.log('Successfully logged network event');
      return response;
    } catch (error) {
      console.error('Failed to log network event:', error);
      return null;
    }
  }

  private async logApiRequest(
    url: string, 
    startTime: number, 
    status: number, 
    responseTime: number, 
    error?: Error
  ) {
    console.log('Logging API request:', {
      url,
      status,
      responseTime,
      error
    });

    return this.logNetworkEvent({
      type: 'api_request',
      message: error ? `API request failed: ${error.message}` : 'API request completed',
      severity: status >= 400 ? 'high' : 'low',
      status: status >= 400 ? 'error' : 'success',
      url,
      httpStatus: status,
      responseTime,
      errorDetails: error?.stack,
      metadata: {
        method: 'GET',
        timestamp: new Date(startTime).toISOString()
      }
    });
  }
}

export const networkMonitor = NetworkMonitoringService.getInstance();