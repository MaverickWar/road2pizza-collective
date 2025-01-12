import { toast } from "sonner";

type ValidationCheck = {
  id: string;
  check: () => boolean | Promise<boolean>;
  message: string;
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

  private constructor() {
    // Initialize default checks
    this.initializeDefaultChecks();

    // Start monitoring cycles
    this.startMonitoringCycles();

    console.log("Monitoring service initialized");
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
          const response = await fetch("/api/health");
          return response.ok;
        } catch {
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
        } catch {
          return false;
        }
      },
      message: "Cache validation failed",
    });

    // Add dashboard stats check
    this.addCheck({
      id: "dashboard-stats",
      check: this.fetchDashboardData,
      message: "Failed to fetch dashboard statistics",
    });
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
    const errorMessage = `Monitoring Alert: ${check.message}`;
    console.error(errorMessage);

    // Show toast notification
    toast.error(errorMessage, {
      duration: 5000,
    });
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
      const response = await fetch("/api/dashboard");
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
}

export const monitoringService = MonitoringService.getInstance();
