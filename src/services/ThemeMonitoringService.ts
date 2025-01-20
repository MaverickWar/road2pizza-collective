import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ThemeError {
  method: string;
  error_type: string;
  message: string;
  url: string;
  stack?: string;
  origin?: string;
  timestamp: string;
}

class ThemeMonitoringService {
  private static instance: ThemeMonitoringService;
  private errorCount: number = 0;
  private readonly ERROR_THRESHOLD = 3;
  private lastErrorTime: number = 0;
  private readonly ERROR_RESET_TIME = 60000; // 1 minute

  private constructor() {
    console.log('Theme monitoring service initialized');
  }

  static getInstance(): ThemeMonitoringService {
    if (!ThemeMonitoringService.instance) {
      ThemeMonitoringService.instance = new ThemeMonitoringService();
    }
    return ThemeMonitoringService.instance;
  }

  async logThemeError(error: any, context: string = 'theme_fetch'): Promise<void> {
    const errorData: ThemeError = {
      method: error.method || 'GET',
      error_type: error.error_type || 'theme_error',
      message: error.message || 'Unknown error',
      url: error.url || window.location.href,
      stack: error.stack,
      origin: error.origin || window.location.origin,
      timestamp: new Date().toISOString()
    };

    console.error('Theme error detected:', errorData);

    try {
      const { error: dbError } = await supabase
        .from('analytics_metrics')
        .insert({
          metric_name: 'theme_error',
          metric_value: this.errorCount + 1,
          metadata: errorData,
          http_status: error.status || 500,
          endpoint_path: new URL(errorData.url).pathname,
          response_time: 0
        });

      if (dbError) {
        console.error('Failed to log theme error:', dbError);
      }

      this.handleErrorThreshold(errorData);
    } catch (err) {
      console.error('Error logging theme metrics:', err);
    }
  }

  private handleErrorThreshold(error: ThemeError): void {
    const now = Date.now();
    if (now - this.lastErrorTime > this.ERROR_RESET_TIME) {
      this.errorCount = 0;
    }
    
    this.errorCount++;
    this.lastErrorTime = now;

    if (this.errorCount >= this.ERROR_THRESHOLD) {
      toast.error('Multiple theme loading errors detected', {
        description: 'The system will attempt to use default theme settings',
        duration: 5000,
      });

      // Log critical error for immediate attention
      console.error('Critical: Multiple theme errors detected', {
        errorCount: this.errorCount,
        lastError: error
      });
    }
  }

  async getErrorStats(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('analytics_metrics')
        .select('*')
        .eq('metric_name', 'theme_error')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching theme error stats:', err);
      return [];
    }
  }
}

export const themeMonitor = ThemeMonitoringService.getInstance();