import { Component, ErrorInfo, ReactNode } from "react";
import { toast } from "sonner";
import { monitoringService } from "@/services/MonitoringService";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Log the error and show toast notification
    const errorMessage = `An unexpected error occurred: ${error.message}`;
    console.error(errorMessage, errorInfo);
    
    toast.error(errorMessage, {
      duration: 5000,
      description: "Please try refreshing the page. If the problem persists, contact support."
    });

    // Add a monitoring check for this specific error
    monitoringService.addCheck({
      id: `error-${Date.now()}`,
      check: () => false, // This will trigger an immediate alert
      message: `Critical error detected: ${error.message}`
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">
              Please try refreshing the page or contact support if the problem persists.
            </p>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;