import { toast } from "sonner";
import { queryClient } from "@/config/queryClient";

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
  private lastErrors: Map<string, { count: number; timestamp: number }> = new Map();

  private constructor() {
    this.initializeDefaultChecks();
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
      id: "query-cache-health",
      check: () => {
        const queries = queryClient.getQueryCache().getAll();
        return queries.every(query => !query.state.error);
      },
      message: "Query cache contains errors",
    });

    this.addCheck({
      id: "data-consistency",
      check: async () => {
        try {
          const queries = queryClient.getQueryCache().getAll();
          const staleQueries = queries.filter(query => query.state.isStale);
          
          // If more than 50% of queries are stale, trigger a refresh
          if (staleQueries.length > queries.length / 2) {
            console.log('Too many stale queries, refreshing...');
            await queryClient.refetchQueries();
          }
          return true;
        } catch (error) {
          console.error('Data consistency check failed:', error);
          return false;
        }
      },
      message: "Data consistency check failed",
    });
  }

  private startMonitoringCycles() {
    let checksCount = 0;
    this.intensiveMonitoringTimeout = setInterval(() => {
      if (checksCount >= 10) {
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
    this.regularMonitoringInterval = setInterval(() => {
      this.runValidations();
    }, 1800000);

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
    const now = Date.now();
    const errorRecord = this.lastErrors.get(check.id);
    
    // Update error count and timestamp
    if (errorRecord) {
      if (now - errorRecord.timestamp < 300000) { // 5 minutes
        errorRecord.count++;
        if (errorRecord.count >= 3) {
          // If same error occurs 3+ times in 5 minutes, refresh queries
          console.log(`Multiple errors for ${check.id}, refreshing queries...`);
          queryClient.refetchQueries();
          this.lastErrors.delete(check.id); // Reset counter
          return;
        }
      } else {
        // Reset if more than 5 minutes passed
        errorRecord.count = 1;
      }
      errorRecord.timestamp = now;
    } else {
      this.lastErrors.set(check.id, { count: 1, timestamp: now });
    }

    const errorMessage = `Monitoring Alert: ${check.message}`;
    console.error(errorMessage);

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
    this.lastErrors.clear();
    console.log("Monitoring service cleaned up");
  }
}

export const monitoringService = MonitoringService.getInstance();