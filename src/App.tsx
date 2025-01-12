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
    // Initialize monitoring service if needed
    console.log("App mounted. Monitoring service initialized.");

    // Cleanup monitoring service on unmount
    return () => {
      console.log("App unmounting. Cleaning up monitoring service...");
      monitoringService.cleanup();
    };
  }, []);

  return (
    <ErrorBoundary>
      {/* React Query Provider to manage API data caching */}
      <QueryProvider>
        {/* React Router for handling client-side routing */}
        <Router>
          {/* Authentication Context Provider */}
          <AuthProvider>
            {/* App Routes */}
            <AppRoutes />
            {/* Global notification system */}
            <Toaster position="top-right" expand={true} richColors />
          </AuthProvider>
        </Router>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;