import { Component, ErrorInfo, ReactNode } from "react";
import { toast } from "sonner";
import { monitoringService } from "@/services/MonitoringService";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    const errorMessage = `An unexpected error occurred: ${error.message}`;
    console.error(errorMessage, errorInfo);
    
    toast.error(errorMessage, {
      duration: 5000,
      description: "Please try refreshing the page. If the problem persists, contact support."
    });

    monitoringService.addCheck({
      id: `error-${Date.now()}`,
      check: () => false,
      message: `Critical error detected: ${error.message}`,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 p-6 max-w-md">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <div className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={this.handleReset}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;