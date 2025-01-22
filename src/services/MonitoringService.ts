import { toast } from "sonner";

type ValidationCheck = {
  id: string;
  check: () => boolean | Promise<boolean>;
  message: string;
  metadata?: Record<string, any>; // Add optional metadata field
};

type DashboardData = {
  alerts: number;
  avgResponseTime: string;
  systemLogs: string[];
};

class MonitoringService {
  private static instance: MonitoringService;
  private checks: ValidationCheck[] = [];
  private intensiveMonitoringTimeout: NodeJS.Timeout | null = null;
  private regularMonitoringInterval: NodeJS.Timeout | null = null;
  private lastNotificationTime: number = 0;
  private notificationDebounceInterval: number = 60000; // 1 minute

  private constructor() {
    // Initialize default checks
    this.initializeDefaultChecks();

    console.log("Monitoring service initialized but not started");
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private initializeDefaultChecks() {
    this.addCheck({
      id: "root-container",
      check: () => {
        const rootElement = document.getElementById("root");
        return rootElement !== null && rootElement.children.length > 0;
      },
      message: "Application root container is empty or missing",
    });

    this.addCheck({
      id: "data-integrity",
      check: async () => {
        try {
          const response = await this.fetchWithRetry("/api/health");
          return response.ok;
        } catch (error) {
          console.error("Data integrity check failed:", error);
          return false;
        }
      },
      message: "Data integrity check failed",
    });

    this.addCheck({
      id: "cache-validation",
      check: () => {
        try {
          const cacheData = localStorage.getItem("app-cache-timestamp");
          if (!cacheData) return true;
          const timestamp = parseInt(cacheData, 10);
          return Date.now() - timestamp < 3600000; // 1 hour
        } catch (error) {
          console.error("Cache validation failed:", error);
          return false;
        }
      },
      message: "Cache validation failed",
    });

    // Add dashboard stats check
    this.addCheck({
      id: "dashboard-stats",
      check: this.fetchDashboardData.bind(this),
      message: "Failed to fetch dashboard statistics",
    });
  }

  public startMonitoring() {
    // Start monitoring cycles
    this.startMonitoringCycles();
  }

  private startMonitoringCycles() {
    // Intensive monitoring for the first 5 minutes (check every 30 seconds)
    let checksCount = 0;
    this.intensiveMonitoringTimeout = setInterval(() => {
      if (checksCount >= 10) {
        // 10 checks * 30 seconds = 5 minutes
        clearInterval(this.intensiveMonitoringTimeout!);
        this.startRegularMonitoring();
        return;
      }
      this.runValidations();
      checksCount++;
    }, 30000);

    console.log("Started intensive monitoring cycle");
  }

  private startRegularMonitoring() {
    // Regular monitoring every 30 minutes
    this.regularMonitoringInterval = setInterval(() => {
      this.runValidations();
    }, 1800000); // 30 minutes

    console.log("Switched to regular monitoring cycle");
  }

  private async runValidations() {
    console.log("Running validation checks...");

    for (const check of this.checks) {
      try {
        const result = await Promise.resolve(check.check());
        if (!result) {
          this.handleFailedCheck(check);
        }
      } catch (error) {
        console.error(`Validation check failed for ${check.id}:`, error);
        this.handleFailedCheck(check);
      }
    }
  }

  private handleFailedCheck(check: ValidationCheck) {
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > this.notificationDebounceInterval) {
      const errorMessage = `Monitoring Alert: ${check.message}`;
      console.error(errorMessage);

      // Show toast notification
      toast.error(errorMessage, {
        duration: 5000,
      });

      // Send error report
      this.sendErrorReport();

      this.lastNotificationTime = currentTime;
    }
  }

  private async sendErrorReport() {
    try {
      const response = await fetch('/functions/v1/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.error('Failed to send error report:', await response.text());
      }
    } catch (error) {
      console.error('Error sending error report:', error);
    }
  }

  public addCheck(check: ValidationCheck) {
    this.checks.push(check);
    console.log(`Added new check: ${check.id}`);
  }

  public cleanup() {
    if (this.intensiveMonitoringTimeout) {
      clearInterval(this.intensiveMonitoringTimeout);
    }
    if (this.regularMonitoringInterval) {
      clearInterval(this.regularMonitoringInterval);
    }
    console.log("Monitoring service cleaned up");
  }

  /**
   * Fetch dashboard data and validate it
   */
  private async fetchDashboardData(): Promise<boolean> {
    try {
      const response = await this.fetchWithRetry("/api/dashboard");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DashboardData = await response.json();

      // Optional: Validate specific fields
      if (
        typeof data.alerts === "number" &&
        typeof data.avgResponseTime === "string" &&
        Array.isArray(data.systemLogs)
      ) {
        console.log("Dashboard data fetched successfully:", data);
        return true;
      } else {
        console.error("Invalid dashboard data format:", data);
        return false;
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return false;
    }
  }

  /**
   * Fetch with retry logic, including handling 401 errors
   */
  private async fetchWithRetry(url: string, retries: number = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          console.error('Unauthorized access. Attempting to refresh token...');
          await this.refreshToken();
          continue; // Retry with a new token
        }

        return response;
      } catch (error) {
        console.error(`Fetch attempt ${i + 1} failed:`, error);
        if (i === retries - 1) {
          throw error;
        }
      }
    }
    throw new Error('All fetch attempts failed');
  }

  /**
   * Retrieve the token from localStorage or other secure storage
   */
  private getToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  /**
   * Refresh the token by making an appropriate API call
   */
  private async refreshToken(): Promise<void> {
    try {
      const response = await fetch('/api/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: localStorage.getItem('refresh_token')
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.auth_token);
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
}

export const monitoringService = MonitoringService.getInstance();
