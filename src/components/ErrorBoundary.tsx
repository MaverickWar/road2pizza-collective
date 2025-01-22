import { Component, ErrorInfo, ReactNode } from "react";
import { toast } from "sonner";
import { monitoringService } from "@/services/MonitoringService";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Determine if it's a rate limit error
    const isRateLimitError = error.message.includes('429') || 
                            error.message.toLowerCase().includes('rate limit');
    
    // Customize error message based on error type
    let errorMessage = isRateLimitError
      ? "Rate limit exceeded. Please wait a moment before trying again."
      : `An unexpected error occurred: ${error.message}`;
    
    let description = isRateLimitError
      ? "Our systems are experiencing high traffic. Please try again in a few minutes."
      : "Please try refreshing the page. If the problem persists, contact support.";

    // Show toast notification
    toast.error(errorMessage, {
      duration: 5000,
      description
    });

    // Add a monitoring check for this specific error
    monitoringService.addCheck({
      id: `error-${Date.now()}`,
      check: () => false,
      message: `Critical error detected: ${error.message}`,
      metadata: {
        errorInfo,
        isRateLimitError
      }
    });

    // Update state to store error details
    this.setState({ error, errorInfo });
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-auto p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              
              <p className="text-muted-foreground">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={this.handleRefresh}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Page
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  If the problem persists, please contact support
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;