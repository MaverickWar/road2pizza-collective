import { supabase } from "@/integrations/supabase/client";

class NetworkMonitoringService {
  private static instance: NetworkMonitoringService;
  
  private constructor() {
    console.log('NetworkMonitoringService initialized');
  }

  public static getInstance(): NetworkMonitoringService {
    if (!NetworkMonitoringService.instance) {
      NetworkMonitoringService.instance = new NetworkMonitoringService();
    }
    return NetworkMonitoringService.instance;
  }

  monitorFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const startTime = performance.now();
    const url = input instanceof Request ? input.url : input.toString();
    
    console.log('Monitoring fetch request:', { url, init });
    
    try {
      const response = await fetch(input, init);
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Only log API requests, not static assets
      if (url.includes('/api/') || url.includes('supabase')) {
        await this.logApiRequest(
          url,
          startTime,
          response.status,
          responseTime,
          response.ok ? undefined : new Error(`HTTP ${response.status}`)
        );
      }
      
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      const endTime = performance.now();
      
      if (error instanceof Error) {
        await this.logApiRequest(url, startTime, 500, endTime - startTime, error);
      }
      throw error;
    }
  };

  private async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }

  async logNetworkEvent(event: {
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
    console.log('Logging network event:', event);

    try {
      // Only proceed if user is authenticated
      if (!await this.isAuthenticated()) {
        console.log('User not authenticated, skipping analytics logging');
        return null;
      }

      const { data, error } = await supabase
        .from('analytics_metrics')
        .insert([{
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
        .select();

      if (error) {
        console.error('Error logging network event:', error);
        return null;
      }

      console.log('Successfully logged network event:', data);
      return data;
    } catch (error) {
      console.error('Failed to log network event:', error);
      return null;
    }
  }

  async logError(error: Error, metadata?: any) {
    console.log('Logging error:', error);

    return this.logNetworkEvent({
      type: 'error',
      message: error.message,
      severity: 'high',
      status: 'open',
      errorDetails: error.stack,
      metadata: {
        ...metadata,
        errorType: error.name,
        componentStack: metadata?.componentStack
      }
    });
  }

  async logApiRequest(url: string, startTime: number, status: number, responseTime: number, error?: Error) {
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