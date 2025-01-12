import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryProvider } from "./providers/QueryProvider";
import AuthProvider from "./components/AuthProvider";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import { useEffect } from "react";
import { monitoringService } from "./services/MonitoringService";

function App() {
  useEffect(() => {
    // Cleanup monitoring service on unmount
    return () => {
      monitoringService.cleanup();
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryProvider>
        <Router>
          <AuthProvider>
            <AppRoutes />
            <Toaster position="top-right" expand={true} richColors />
          </AuthProvider>
        </Router>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;